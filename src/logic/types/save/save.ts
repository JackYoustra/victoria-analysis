import {
  AdminReform, AllianceType,
  ArmySchools,
  Background,
  EducationReform,
  FactoryType,
  FinanceReform,
  ForeignNavalOfficers,
  ForeignNavies,
  ForeignOfficers,
  ForeignTraining,
  ForeignWeapons,
  Government,
  GovernmentFlag,
  Ideology,
  IndustrialConstruction, LandReform,
  MilitaryConstructions,
  NationalFocus,
  Nationalvalue,
  NavalNeed,
  NavalSchools,
  NavalSupplyCost,
  NewsScopeType,
  PlayerBalance,
  PreIndust,
  PriceChange,
  RegimentType,
  Religion,
  SampleSaveType,
  SchoolReforms,
  Schools,
  TransportImprov,
  UpperHouse
} from "./vanillaConfigurations";
import {Artisan, Freeman, MiddleClass, POP, UpperClass} from "./pops";

type VickyDate = Date;

export interface Save {
  [province_id: number]: Province;
  date: VickyDate;
  // Tag
  player: string;
  government: number;
  automate_trade: StringBoolean;
  automate_sliders: number;
  rebel: number;
  unit: number;
  state: number;
  flags: { [key: string]: "yes" };
  gameplaysettings: { setgameplayoptions?: number[]; };
  start_date: VickyDate;
  start_pop_index: number;
  worldmarket: WorldMarket;
  great_wars_enabled?: StringBoolean;
  world_wars_enabled?: StringBoolean;
  overseas_penalty?: OverseasPenalty;
  unit_cost: { [key: string]: number };
  budget_balance: number[];
  player_monthly_pop_growth: number[];
  player_monthly_pop_growth_tag: string;
  player_monthly_pop_growth_date: VickyDate;
  // Party enable date
  // [party: string]: VickyDate
  canals: number[];
  id: IDElement;
  fired_events?: { id: IDElement[] | IDElement };
  // [tag: string]: Country;
  rebel_faction: RebelFaction;
  diplomacy: GlobalDiplomacy;
  combat?: { siege_combat?: SiegeCombat[] | SiegeCombat; };
  active_war?: War[] | War;
  previous_war?: War[] | War;
  invention?: number[] | number;
  great_nations: number[];
  outliner: number[];
  news_collector: NewsCollector;
  crisis_manager: VickyDate;
  region?: CrisisRegion[] | CrisisRegion;
}

export interface War {
  name:               string;
  history:            History;
  attacker:           string[] | string;
  defender:           string[] | string;
  original_attacker:  string;
  original_defender:  string;
  original_wargoal:   Goal;
  action:             string;
  war_goal:           Goal;
}

export type OverseasPenalty = {
  clipper_convoy?:                      number;
  steamer_convoy?:                      number;
} | {
  [shipType: string]: number;
};

export interface WorldMarket {
  worldmarket_pool:                    { [key: string]: number };
  price_pool:                          { [key: string]: number };
  last_price_history:                  { [key: string]: number };
  supply_pool:                         { [key: string]: number };
  last_supply_pool:                    { [key: string]: number };
  price_history:                       { [key: string]: number }[];
  price_history_last_update:           string;
  price_change:                        PriceChange;
  discovered_goods:                    { [key: string]: number };
  actual_sold:                         { [key: string]: number };
  actual_sold_world:                   { [key: string]: number };
  real_demand:                         { [key: string]: number };
  demand:                              { [key: string]: number };
  player_balance:                      PlayerBalance;
  player_pops_consumption_cache:       { [key: string]: number }[];
}

export interface Country {
  tax_base: number;
  flags?:                               { [key: string]: "yes" };
  variables?:                           EmptySet;
  capital: number;
  research_points: number;
  technology: { [key: string]: number[] };
  research?:                            Research;
  last_reform?:                         string;
  last_election: VickyDate;
  election?:                            string;
  // string of the reform selected
  // [reformName: string]: string;
  // The support of each party in the upper house
  upper_house: UpperHouse | { [party: string]: number };
  last_lost_war?:                       string;
  ruling_party: number;
  active_party: number[];
  naval_need?:                          NavalNeed;
  land_supply_cost?:                    LandSupplyCost;
  naval_supply_cost?:                   NavalSupplyCost;
  diplomatic_points: number;
  religion: Religion | string;
  government: Government | string;
  plurality: number;
  revanchism: number;
  modifier?:                            ModifierElement[] | ModifierElement;
  rich_tax: Tax;
  middle_tax: Tax;
  poor_tax: Tax;
  education_spending: SpendingRange;
  crime_fighting: SpendingRange;
  social_spending: SpendingRange;
  military_spending: SpendingRange;
  overseas_penalty: number;
  leadership: number;
  auto_assign_leaders: StringBoolean;
  auto_create_leaders: StringBoolean;
  leader?:                              LeaderElement[] | LeaderElement;
  army?:                                ArmyElement[] | PurpleArmy;
  navy?:                                NavyElement[] | NavyElement;
  active_inventions?:                   number[];
  possible_inventions?:                 number[];
  // [countryTag: string]: DiplomaticStatus;
  illegal_inventions?:                  number[];
  // Not right, but whatever
  government_flag:                     GovernmentFlag;
  last_mission_cancel:                 "1.1.1";
  ai_hard_strategy?:                    AIHardStrategy;
  ai?:                                  AI;
  foreign_investment?:                  number[];
  mobilize?:                            StringBoolean;
  human?:                               StringBoolean;
  schools?:                             Schools | string;
  primary_culture?:                     string;
  culture?:                             string[];
  prestige?:                            number;
  bank?:                                BankClass;
  money?:                               number;
  last_bankrupt?:                       string;
  creditor?:                            CreditorElement[] | CreditorElement;
  movement?:                            MovementElement[] | MovementElement;
  stockpile?:                           { [key: string]: number };
  nationalvalue?:                       Nationalvalue;
  buy_domestic?:                        EmptySet;
  trade?:                               { [key: string]: Trade };
  civilized?:                           StringBoolean;
  last_greatness_date?:                 string;
  state?:                               State[] | State;
  badboy?:                              number;
  tariffs?:                             number;
  trade_cap_land?:                      number;
  trade_cap_naval?:                     number;
  trade_cap_projects?:                  number;
  max_tariff?:                          number;
  domestic_supply_pool?:                { [key: string]: number };
  sold_supply_pool?:                    EmptySet;
  domestic_demand_pool?:                { [key: string]: number };
  actual_sold_domestic?:                { [key: string]: number };
  saved_country_supply?:                { [key: string]: number };
  max_bought?:                          { [key: string]: number };
  national_focus?:                      { [key: string]: NationalFocus };
  influence?:                           Influence;
  expenses?:                            number[];
  incomes?:                             number[];
  interesting_countries?:               number[];
  next_quarterly_pulse?:                string;
  next_yearly_pulse?:                   string;
  suppression?:                         number;
  railroads?:                           Railroad[] | Railroad;
  is_releasable_vassal?:                StringBoolean;
  campaign_counter?:                    number;
  last_party_change?:                   string;
  cb_generation?:                       CbGeneration;
  domain_region?:                       string;

  // Unciv stuff
  land_reform?:                         LandReform;
  admin_reform?:                        AdminReform;
  finance_reform?:                      FinanceReform;
  education_reform?:                    EducationReform;
  transport_improv?:                    TransportImprov;
  pre_indust?:                          PreIndust;
  industrial_construction?:             IndustrialConstruction;
  foreign_training?:                    ForeignTraining;
  foreign_weapons?:                     ForeignWeapons;
  military_constructions?:              MilitaryConstructions;
  foreign_officers?:                    ForeignOfficers;
  army_schools?:                        ArmySchools;
  foreign_naval_officers?:              ForeignNavalOfficers;
  naval_schools?:                       NavalSchools;
  foreign_navies?:                      ForeignNavies;
  war_exhaustion?:                      number;
  diplomatic_action?:                   DiplomaticAction;
}

export interface RebelFaction {
  id?:                 IDElement;
  type?:               SampleSaveType;
  name?:               string;
  country?:            string;
  independence?:       string;
  culture?:            string;
  religion?:           Religion;
  government?:         Government;
  province?:           number;
  leader?:             IDElement;
  organization?:       number;
  pop?:                IDElement[] | IDElement;
  next_unit?:          number;
  unit_names?:         UnitNames;
  provinces?:          number[];
  army?:               IDElement[] | IDElement;
}

export interface CrisisRegion {
  index?:              number;
  phase?:              number;
  date?:               VickyDate;
  temperature?:        number;
}

export interface GlobalDiplomacy {
  vassal?:                              Alliance[] | Alliance;
  alliance?:                            Alliance[] | Alliance;
  casus_belli?:                         Alliance[] | Alliance;
}

export interface IDElement {
  id:   number;
  type: number;
}

export enum StringBoolean {
  No = "no",
  Yes = "yes",
}

export interface History {
  name?:         string;
  battle?:       Battle[] | Battle;
  // [date: VickyDate]: HistoryElement[] | HistoryElement
    // Not used, needed for type system
    // | Battle[] | Battle | string | undefined;
}

export interface HistoryElement {
  rem_defender?: string;
  rem_attacker?: string;
  add_attacker?: string;
  add_defender?: string;
  war_goal?: WarGoal;
}

export interface WarGoal {
  casus_belli: string;
  actor:       string;
  receiver:    string;
}

export interface Battle {
  name:     string;
  location: number;
  result:   StringBoolean;
  attacker: Combatant;
  defender: Combatant;
}

export interface Combatant {
  // Country tag
  country: string;
  leader:  string;
  losses:  number;
  // Guaranteed to only be number
  [unitName: string]: number | string;
}

export interface Goal {
  casus_belli?:       string;
  actor?:             string;
  receiver?:          string;
  state_province_id?: number;
  score?:             number;
  change?:            number;
  date?:              string;
  is_fulfilled?:      StringBoolean;
  region?:            number;
  country?:           string;
}

export interface UnitNames {
  data: Datum[];
}

export interface Datum {
  count?: number;
  id?:    number[];
}

export interface Province {
  name:                                string;
  owner:                               string;
  controller:                          string;
  core:                                string[] | string;
  garrison:                            number;
  fort:                                number[];
  railroad:                            number[];
  nationalism:                         number;
  aristocrats?:                         UpperClass[] | UpperClass;
  capitalists?:                         UpperClass[] | UpperClass;
  artisans?:                            Artisan[] | Artisan;
  bureaucrats?:                         MiddleClass[] | MiddleClass;
  clergymen?:                           MiddleClass[] | MiddleClass;
  clerks?:                              MiddleClass[] | MiddleClass;
  craftsmen?:                           MiddleClass[] | MiddleClass;
  labourers?:                           MiddleClass[] | MiddleClass;
  farmers?:                             MiddleClass[] | MiddleClass;
  officers?:                            MiddleClass[] | MiddleClass;
  soldiers?:                            MiddleClass[] | MiddleClass;
  slaves?:                              POP[] | POP;

  building_construction?:               BuildingConstructionElement[] | BuildingConstructionElement;
  rgo?:                                 Rgo;
  life_rating?:                         number;
  infrastructure?:                      number;
  last_imigration?:                     string;
  last_controller_change?:              string;
  party_loyalty?:                       PartyLoyaltyElement[] | PartyLoyaltyElement;
  crime?:                               number;
  unit_names?:                          UnitNames;
  naval_base?:                          number[];
  colonial?:                            number;
  military_construction?:               MilitaryConstructionElement[] | MilitaryConstructionElement;
  // [globalFlag: string]:                 StringBoolean;
}

export interface DiplomaticStatus {
  value: number;
  last_send_diplomat?: string;
  last_war?: string;
  truce_until?: string;
  level?: number;
  military_access?: StringBoolean;
  level_changed_date?: string;
  influence_value?: number;
  ban_embassy?: string;
  ban_embassy_country?: string;
  discredit?: string;
  discreditor?: string;
}

export interface NewsCollector {
  news_scope?:                          NewsScope[];
  built_news?:                          BuiltNew[];
  date?:                                string;
  tension?:                             number;
}

export interface AI {
  initialized:      StringBoolean;
  consolidate:      StringBoolean;
  date:             string;
  static:           StringBoolean;
  personality:      string;
  conquer_prov?:    ConquerProv[];
  threat?:          CountryScalar[] | CountryScalar;
  antagonize?:      CountryScalar[] | CountryScalar;
  befriend?:        CountryScalar[] | CountryScalar;
  protect?:         CountryScalar[] | CountryScalar;
  rival?:           CountryScalar[] | CountryScalar;
  military_access?: CountryScalar[] | CountryScalar;
  building_prov?:   BuildingProv;
  war_with?:        CountryScalar;
}

export interface CountryScalar {
  // The tag
  id:    string;
  value: number;
}

export interface BuildingProv {
  // Building name
  key:   string;
  id:    number;
  value: number;
}

export interface ConquerProv {
  id:    number;
  value: number;
}

export interface AIHardStrategy {
  initialized: StringBoolean;
  consolidate: StringBoolean;
  date:        VickyDate;
  static:      StringBoolean;
  // All I've seen is the "balanced" strategy
  personality: string;
}

export interface Alliance {
  first:      string;
  second:     string;
  end_date?:  VickyDate;
  start_date: string;
  type?:      AllianceType;
}

export interface ArmyElement {
  id:                 IDElement;
  name:               string;
  leader?:            IDElement;
  previous?:          number;
  movement_progress?: number;
  location:           number;
  dig_in_last_date:   VickyDate;
  supplies:           number;
  regiment:           RegimentElement[] | RegimentElement;
  base?:              number;
  path?:              number[];
  dig_in?:            number;
  target?:            number;
}

export interface RegimentElement {
  id:           IDElement;
  name:         string;
  pop?:         IDElement;
  organisation: number;
  strength:     number;
  count?:       number;
  type:         RegimentType;
  experience?:  number;
}

export interface PurpleArmy {
  id:                 IDElement;
  name:               string;
  leader:             IDElement;
  previous?:          number;
  movement_progress?: number;
  location:           number;
  dig_in_last_date:   VickyDate;
  supplies:           number;
  regiment:           RegimentElement[] | RegimentElement;
  base:               number;
  path?:              number[];
}

export interface BankClass {
  money:      number;
  money_lent: number;
}

export interface BuildingConstructionElement {
  id:           IDElement;
  start_date:   string;
  date:         string;
  location:     number;
  country:      string;
  building:     number;
  input_goods?: BuildingConstructionInputGoods;
}

export interface BuildingConstructionInputGoods {
  goods_demand: { [good: string]: number };
  input_goods:  { [good: string]: number };
  money:        number;
}

export interface BuiltNew {
  is_read:     StringBoolean;
  date:        string;
  article:     Article[];
  style:       number;
  seed:        number;
  // Holds the path to the image of a newspaper title, such as "news/generic_newspaper_title.dds"
  title_image: string;
}

export interface Article {
  size:       Size;
  news_scope: NewsScope;
}

export interface NewsScope {
  type:      NewsScopeType;
  tags?:     Array<string[] | EmptySet | string>;
  strings?:  Array<string[] | EmptySet | string>;
  dates:     string[];
  name?:     string;
  freshness: number;
  values?:   string[];
}

export interface EmptySet {
}

export enum Size {
  Large = "large",
  Medium = "medium",
  Small = "small",
}

export interface CbGeneration {
  target:     string;
  progress:   number;
  discovered: StringBoolean;
  type:       string;
}

export interface CreditorElement {
  country:  string;
  interest: number;
  debt:     number;
  was_paid: StringBoolean;
}

export interface SpendingRange {
  settings:      number;
  temp_settings: number;
  factor:        number;
  reserve:       number;
  maxValue:      number;
  rangeLimitMax: number;
  rangeLimitMin: number;
  max_tax:       number;
  min_tax:       number;
}

export interface DiplomaticAction {
  call_ally: CallAlly;
}

export interface CallAlly {
  type:              number;
  actor:             string;
  recipient:         string;
  date:              string;
  last_command_date: string;
  // Country tag
  versus:            string;
}

export interface Influence {
  // "\"SIA\""?: string;
  [key: string]: string;
}

export interface LandSupplyCost {
  ammunition?:  number;
  small_arms?:  number;
  artillery?:   number;
  canned_food?: number;
  explosives?:  number;
  barrels?:     number;
  fuel?:        number;
  wool?:        number;
}

export interface LeaderElement {
  name:        string;
  date:        string;
  type:        LeaderType;
  personality: string;
  background:  Background;
  country:     string;
  picture:     string;
  prestige:    number;
  id:          IDElement;
}

export enum LeaderType {
  Land = "land",
  Sea = "sea",
}

export interface Tax {
  current:       number;
  // Tax income history
  tax_income:    number[];
  // Tax efficiency history
  tax_eff:       number[];
  total:         number;
  // The max % the slider can be set to
  rangeLimitMax: number;
  // The min % the slider can be set to
  rangeLimitMin: number;
  max_tax:       number;
  min_tax:       number;
}

export interface MilitaryConstructionElement {
  id:           IDElement;
  start_date:   string;
  date:         string;
  location:     number;
  country:      string;
  input_goods?: MilitaryConstructionInputGoods;
  name:         string;
  type:         RegimentType;
  unit:         IDElement;
  regiment:     IDElement;
  pop?:         IDElement;
  count:        number;
  rally_point:  string;
}

export interface MilitaryConstructionInputGoods {
  goods_demand: { [key: string]: number };
  input_goods:  { [key: string]: number };
  money:        number;
}

export interface ModifierElement {
  modifier: string;
  date:     string;
}

export interface MovementElement {
  issue?:      SchoolReforms;
  support?:    number;
  cache?:      number;
  tag?:        string;
  radicalism?: number;
}

export interface NavyElement {
  id:                 IDElement;
  name:               string;
  previous?:          number;
  movement_progress?: number;
  path?:              number[];
  location:           number;
  dig_in_last_date:   VickyDate;
  supplies:           number;
  ship:               RegimentElement[] | RegimentElement;
  army?:              NavyArmy;
  at_sea:             number;
  no_supply_days:     number;
  leader?:            IDElement;
}

export interface NavyArmy {
  id:                IDElement;
  name:              string;
  leader:            IDElement;
  previous:          number;
  movement_progress: number;
  location:          number;
  dig_in_last_date:  VickyDate;
  supplies:          number;
  regiment:          RegimentElement;
  target:            number;
  base:              number;
}


export interface PartyLoyaltyElement {
  ideology:      Ideology;
  loyalty_value: number;
}

export interface Railroad {
  path: number[];
}

export interface Research {
  technology:    string;
  cost:          number;
  max_producing: number;
  last_spending: number;
  active:        StringBoolean;
}

export interface Rgo {
  employment:  RgoEmployment;
  last_income: number;
  goods_type:  string;
}

export interface RgoEmployment {
  province_id: number;
  employees?:  Employee[] | Employee;
}

export interface Employee {
  province_pop_id: ProvincePopID;
  count:           number;
}

export interface ProvincePopID {
  province_id: number;
  index:       number;
  type:        number;
}

export interface SiegeCombat {
  location: number;
  day:      string;
  duration: number;
  attacker: SiegeCombatAttacker;
  defender: SiegeCombatAttacker;
  total:    number;
}

export interface SiegeCombatAttacker {
  dice:               number;
  unit?:              IDElement[] | IDElement;
  losses:             number;
  accumulated_losses: number[];
  front:              EmptySet;
  back:               EmptySet;
}

export interface State {
  id:               IDElement;
  provinces:        number[];
  state_buildings?: Factory[] | Factory;
  savings:          number;
  interest:         number;
  flashpoint?:      StringBoolean;
  crisis?:          string;
  popproject?:      Popproject;
  name?:            string;
  is_colonial?:     number;
  tension?:         number;
  is_slave?:        StringBoolean;
}


export interface Popproject {
  input_goods: { [good: string]: number };
  money:       number;
  building:    number;
  index:       number;
  type:        number;
  money2:      StringBoolean;
  pop:         number;
  province?:   number;
}

export interface Factory {
  building:                FactoryType | string;
  level:                   number;
  stockpile:               { [key: string]: number };
  employment:              FactoryEmployment;
  money:                   number;
  last_spending:           number;
  last_income:             number;
  pops_paychecks:          number;
  last_investment:         number;
  unprofitable_days:       number;
  subsidised?:             StringBoolean;
  leftover:                number;
  injected_money:          number;
  injected_days:           number;
  produces:                number;
  profit_history_days:     number;
  profit_history_current:  number;
  profit_history_entry:    number[];
  construction_time_left?: number;
  input_goods?:            FactoryInputGoods;
  priority?:               number;
  days_without_input?:     number;
}

export interface FactoryEmployment {
  state_province_id: number;
  employees?:        Employee[] | Employee;
}

export interface FactoryInputGoods {
  goods_demand: { [good: string]: number };
  input_goods:  { [good: string]: number };
  money:        number;
}

export interface Trade {
  limit:          number;
  buy:            StringBoolean;
  automate_trade: StringBoolean;
}
