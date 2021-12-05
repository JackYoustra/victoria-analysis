import _, {omit} from "lodash";
import {Country, HistoryElement, Province, Save, State, War} from "../types/save/save";
import {box} from "../collections/collections";
import {expansivePopsIn, popsIn} from "../types/save/pops";

function getProvinces(vickySave: any): Province[] {
  const provinceTest = new RegExp('^[0-9]+$');
  const topKeys = Object.keys(vickySave);
  let provinces: any[] = [];
  for (const rootKey of topKeys) {
    if (provinceTest.test(rootKey)) {
      const province = vickySave[rootKey];
      provinces.push(province);
    }
  }
  return provinces;
}

function getPops(provinces: any[]): any[] {
  let pops: any[] = [];
  for (const province of provinces) {
    for (let [popTitle, popMaybeArr] of Object.entries(province) as [string, any]) {
      // Pops have an ideology tag associated with them, use that to distinguish pop from fake pop
      // https://stackoverflow.com/questions/3476255/in-javascript-how-can-i-tell-if-a-field-exists-inside-an-object
      popMaybeArr = box(popMaybeArr);
      for (const popMaybe of popMaybeArr) {
        if (popMaybe.hasOwnProperty('ideology')) {
          // We're looking at an actual pop, great!
          // Need to remove ethnicity or it's a mess!
          // Should be the third property
          const ethnicity = Object.keys(popMaybe)[2];
          const culture = popMaybe[ethnicity];
          // https://stackoverflow.com/a/34710102/998335
          const cleanedPop = omit(popMaybe, ethnicity);
          const pop = {
            home: province['name'],
            nationality: province['owner'],
            occupation: popTitle,
            ethnicity: ethnicity,
            culture: culture,
            // @ts-ignore
            ...Object.flatten(cleanedPop)
          }
          // https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
          // @ts-ignore
          const orderedPop = Object.sortedByKeys(pop)
          pops.push(orderedPop);
        }
      }
    }
  }
  return pops;
}

interface TaggedCountry extends Country {
  tag: string;
}

function getCountries(vickySave: any): TaggedCountry[] {
  const countryTest = new RegExp('^[A-Z]{3}$');
  const topKeys = Object.keys(vickySave);
  let countries: any[] = [];
  for (const countryTag of topKeys.filter(value => { return countryTest.test(value); })) {
    const country = {
      tag: countryTag,
      ...vickySave[countryTag]
    };
    countries.push(Object.sortedByKeys(country))
  }
  return countries;
}

function getFactories(vickySave: any): any[] {
  const countryTest = new RegExp('^[A-Z]{3}$');
  const topKeys = Object.keys(vickySave);
  let factories: any[] = [];
  const validCountries = topKeys.filter(value => { return countryTest.test(value); });
  for (const countryTag of validCountries) {
    const country = vickySave[countryTag];
    if (country.hasOwnProperty('state')) {
      for (const state of box(country['state'])) {
        const state_id = state["id"]["id"];
        if (state.hasOwnProperty('state_buildings')) {
          for (const building of box(state['state_buildings'])) {
            const employmentTag = "employment";
            const cleanedBuilding = omit(building, employmentTag);
            const employment = building[employmentTag];

            const employeeTag = "employees";
            const cleanedEmployment = omit(employment, employeeTag);
            const employees = box(employment[employeeTag] ?? []);
            let newEmployees = employees.reduce((previousValue, currentValue) => {
              const currentPop = currentValue["province_pop_id"];
              const type = currentPop['type'];
              const count = currentValue['count'];
              if (previousValue.hasOwnProperty(type)) {
                previousValue[type] += count;
              } else {
                previousValue[type] = count;
              }
              return previousValue;
            }, {});

            const factory = {
              country: countryTag,
              state: state_id,
              employment: {
                employees: newEmployees,
                ...cleanedEmployment
              },
              ...cleanedBuilding
            }
            factories.push(Object.sortedByKeys(Object.flatten(factory)));
          }
        }
      }
    }
  }
  return factories;
}

const vickyDateRegex = new RegExp(String.raw`([0-9]+)\.([0-9]+)\.([0-9]+)`);
export function parseDate(from: string): Date | undefined {
  const match = from.match(vickyDateRegex);
  if (match?.length == 4) {
    const [{}, year, month, date] = match;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(date)); // lol js months start at 0
  }
  return undefined;
}


export interface WarResult {
  attacker: WarFactionResult,
  defender: WarFactionResult,
  start: Date,
  end: Date,
}

export type LossesType = { [country: string]: { [leader: string]: number }};

interface WarFactionResult {
  term: TermStructure,
  // [country~leader] : losses
  // by individual leader and principal result
  losses: LossesType,
}

// Country tag to when they entered and left the war, and if they're still in the war
export type TermStructure = { [name: string] : { inWar: boolean; enterLeaveWarDates: string[] } };

export function ProcessWar(war: War): WarResult {
  const history = (() => {
    const dateRegex = new RegExp('[0-9]+.[0-9]+.[0-9]+');
    return Object.entries(war.history).filter( value => {
      const [key, {}] = value;
      return key.search(dateRegex) != -1;
    });
  })() as unknown as [string, HistoryElement][];

  const resultStructure: WarResult = {
    attacker: { term: {}, losses: {} },
    defender: { term: {}, losses: {} },
    start: parseDate(history[0][0]) ?? new Date(1, 1, 1),
    end: parseDate(history[history.length - 1][0]) ?? new Date(1, 1, 1),
  };

  // Losses as the first side on
  const attackers = new Set<string>();
  const defenders = new Set<string>();

  for (const [date, actions] of history) {
    for (const action of box(actions)) {
      if (action.add_attacker) {
        if (!defenders.has(action.add_attacker)) {
          attackers.add(action.add_attacker);
        }
        if (resultStructure.attacker.term[action.add_attacker]) {
          if (resultStructure.attacker.term[action.add_attacker].inWar) {
            // don't record, already in war
          } else {
            resultStructure.attacker.term[action.add_attacker].enterLeaveWarDates.push(date);
            resultStructure.attacker.term[action.add_attacker].inWar = true;
          }
        } else {
          resultStructure.attacker.term[action.add_attacker] = {
            inWar: true,
            enterLeaveWarDates: [date],
          }
        }
      } else if (action.add_defender) {
        if (!attackers.has(action.add_defender)) {
          defenders.add(action.add_defender);
        }
        if (resultStructure.defender.term[action.add_defender]) {
          if (resultStructure.defender.term[action.add_defender].inWar) {
            // don't record, already in war
          } else {
            resultStructure.defender.term[action.add_defender].enterLeaveWarDates.push(date);
            resultStructure.defender.term[action.add_defender].inWar = true;
          }
        } else {
          resultStructure.defender.term[action.add_defender] = {
            inWar: true,
            enterLeaveWarDates: [date],
          }
        }
      } else if (action.rem_attacker) {
        if (resultStructure.attacker.term[action.rem_attacker]) {
          if (!resultStructure.attacker.term[action.rem_attacker].inWar) {
            // don't record, already not in war
          } else {
            resultStructure.attacker.term[action.rem_attacker].enterLeaveWarDates.push(date);
            resultStructure.attacker.term[action.rem_attacker].inWar = false;
          }
        }
      } else if (action.rem_defender) {
        if (resultStructure.defender.term[action.rem_defender]) {
          if (!resultStructure.defender.term[action.rem_defender].inWar) {
            // don't record, already not in war
          } else {
            resultStructure.defender.term[action.rem_defender].enterLeaveWarDates.push(date);
            resultStructure.defender.term[action.rem_defender].inWar = false;
          }
        }
      }
    }
  }

  for (const battle of box(war.history.battle)) {
    for (const side of [battle.attacker, battle.defender]) {
      const key: [string, string] = [side.country, side.leader];
      if (attackers.has(side.country)) {
        if (!resultStructure.attacker.losses[side.country]) {
          resultStructure.attacker.losses[side.country] = {}
        }
        resultStructure.attacker.losses[side.country][side.leader] = (resultStructure.attacker.losses[side.country][side.leader] ?? 0) + side.losses;
      } else if (defenders.has(side.country)) {
        if (!resultStructure.defender.losses[side.country]) {
          resultStructure.defender.losses[side.country] = {}
        }
        resultStructure.defender.losses[side.country][side.leader] = (resultStructure.defender.losses[side.country][side.leader] ?? 0) + side.losses;
      } else {
        console.log(`One of these battles should have the attacker or defender... ${JSON.stringify(battle)}`)
      }
    }
  }

  return resultStructure;
}

// Workers of the world unite! Calculate shadow prices of each good, according to full LP
export function calculateNeeds(save: VickySave, poptypes: { [poptypes: string]: any }) {
  const prices = save.original.worldmarket.price_pool;
  const vars: { name: string, coef: number }[] = [];
  let id = 0;
  for (const pop of save.pops) {
    // one variable per basket! (not per good for now)
    vars.push({ name: `${id}`, coef: pop[""] })
    id += 1;
  }
  let lp = {
    name: 'LP',
    objective: {
      // direction: glpk.GLP_MAX,
      name: 'militancy',
      vars: [
        { name: 'x1', coef: 0.6 },
        { name: 'x2', coef: 0.5 }
      ]
    },
    subjectTo: [
      {
        name: 'cons1',
        vars: [
          { name: 'x1', coef: 1.0 },
          { name: 'x2', coef: 2.0 }
        ],
        // bnds: { type: glpk.GLP_UP, ub: 1.0, lb: 0.0 }
      },
      {
        name: 'cons2',
        vars: [
          { name: 'x1', coef: 3.0 },
          { name: 'x2', coef: 1.0 }
        ],
        // bnds: { type: glpk.GLP_UP, ub: 2.0, lb: 0.0 }
      }
    ]
  };
}

export class VickySave {
  readonly provinces: Province[];
  readonly pops: any[];
  readonly factories: any[];
  readonly countries: TaggedCountry[];
  readonly views: VickyViews;
  readonly original: Save;
  constructor(vickySave: Save) {
    this.original = vickySave;
    this.provinces = getProvinces(vickySave);
    this.pops = getPops(this.provinces);
    this.factories = getFactories(vickySave);
    this.countries = getCountries(vickySave);
    this.views = createVickyViews(this);
  }
}

export interface EnhancedProvince extends Province {
  jurisdiction: State,
  gdp: number,
  wealth: number,
}

interface VickyViews {
  readonly provinces: EnhancedProvince[];
}

function createVickyViews(save: VickySave): VickyViews {
  const provinces: EnhancedProvince[] = Array(save.provinces.length);
  for (const country of save.countries) {
    for (const state of box(country.state)) {

      for (const provID of state.provinces) {
        const province = save.provinces[provID];
        let gdp = 0;
        let wealth = 0;
        for (const pop of expansivePopsIn(province)) {
          gdp += (pop.production_income ?? 0);
          wealth += pop.money + (pop.bank ?? 0);
        }
        for (const building of box(state.state_buildings)) {
          let totalWorkers = 0;
          let provinceWorkers = 0;
          for (const employment of box(building.employment)) {
            for (const employee of box(employment.employees)) {
              if (employment.state_province_id == provID) {
                provinceWorkers += employee.count;
              } else {
                totalWorkers += employee.count;
              }
            }
            totalWorkers += provinceWorkers;
            // Try to capture fractional share of factory GDP, so we look at profits + wages (back out of spending)
            gdp += (building.last_income - building.last_spending + building.pops_paychecks) * (provinceWorkers / totalWorkers);
          }
        }

        provinces[provID] = {
          ...province,
          jurisdiction: state,
          gdp: gdp,
          wealth: wealth,
        }
      }
    }
  }

  return {
    provinces: provinces,
  }
}
