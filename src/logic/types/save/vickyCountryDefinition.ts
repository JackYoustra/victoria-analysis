export interface Country {
  graphical_culture: string;
  color:             number[];
  party:             Party[];
  // Can be more units
  unit_names:        UnitNames | any;
}

export interface Party {
  name:               string;
  start_date:         Date;
  end_date:           Date;
  ideology:           string;
  economic_policy:    string;
  trade_policy:       TradePolicy;
  religious_policy:   string;
  citizenship_policy: CitizenshipPolicy;
  war_policy:         WarPolicy;
}

export enum CitizenshipPolicy {
  FullCitizenship = "full_citizenship",
  LimitedCitizenship = "limited_citizenship",
  Residency = "residency",
}

export enum TradePolicy {
  FreeTrade = "free_trade",
  Protectionism = "protectionism",
}

export enum WarPolicy {
  AntiMilitary = "anti_military",
  Jingoism = "jingoism",
  ProMilitary = "pro_military",
}

export interface UnitNames {
  dreadnought:       string[];
  battleship:        string[];
  ironclad:          string[];
  manowar:           string[];
  cruiser:           string[];
  frigate:           string[];
  monitor:           string[];
  clipper_transport: string[];
  steam_transport:   string[];
  commerce_raider:   string[];
}
