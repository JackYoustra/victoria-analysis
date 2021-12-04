import _ from "lodash";

export interface ProductionTypes {
  factory_template:           Template;
  cheap_factory_template:     Template;
  machine_part_user_template: Template;
  cement_template:            Template;
  aeroplane_factory:          Factory;
  barrel_factory:             Factory;
  automobile_factory:         Factory;
  radio_factory:              Factory;
  telephone_factory:          Factory;
  electric_gear_factory:      Factory;
  machine_parts_factory:      Factory;
  synthetic_oil_factory:      Factory;
  fuel_refinery:              Factory;
  steamer_shipyard:           Factory;
  luxury_clothes_factory:     Factory;
  luxury_furniture_factory:   Factory;
  steel_factory:              Factory;
  artillery_factory:          Factory;
  clipper_shipyard:           Factory;
  small_arms_factory:         Factory;
  furniture_factory:          Factory;
  paper_mill:                 Factory;
  regular_clothes_factory:    Factory;
  explosives_factory:         Factory;
  ammunition_factory:         Factory;
  canned_food_factory:        Factory;
  dye_factory:                Factory;
  liquor_distillery:          Factory;
  winery:                     Factory;
  lumber_mill:                Factory;
  fabric_factory:             Factory;
  cement_factory:             Factory;
  glass_factory:              Factory;
  fertilizer_factory:         Factory;
  RGO_template_farmers:       RGOTemplate;
  RGO_template_labourers:     RGOTemplate;
  cattle_ranch:               RGO;
  coal_mine:                  RGO;
  coffee_plantation:          RGO;
  cotton_plantation:          RGO;
  dye_plantation:             RGO;
  fishing_wharf:              RGO;
  grain_farm:                 RGO;
  iron_mine:                  RGO;
  oil_rig:                    RGO;
  opium_plantation:           RGO;
  orchard:                    RGO;
  precious_metal_mine:        RGO;
  rubber_lodge:               RGO;
  sheep_ranch:                RGO;
  silkworm_ranch:             RGO;
  sulphur_mine:               RGO;
  tea_plantation:             RGO;
  timber_lodge:               RGO;
  tobacco_plantation:         RGO;
  tropical_wood_lodge:        RGO;
  artisan_aeroplane:          Artisan;
  artisan_barrel:             Artisan;
  artisan_automobile:         Artisan;
  artisan_radio:              Artisan;
  artisan_telephone:          Artisan;
  artisan_electric_gear:      Artisan;
  artisan_machine_parts:      Artisan;
  artisan_fuel:               Artisan;
  artisan_steamer:            Artisan;
  artisan_luxury_clothes:     Artisan;
  artisan_luxury_furniture:   Artisan;
  artisan_steel:              Artisan;
  artisan_artillery:          Artisan;
  artisan_clipper:            Artisan;
  artisan_small_arms:         Artisan;
  artisan_furniture:          Artisan;
  artisan_paper:              Artisan;
  artisan_regular_clothes:    Artisan;
  artisan_explosives:         Artisan;
  artisan_ammunition:         Artisan;
  artisan_canned_food:        Artisan;
  artisan_liquor:             Artisan;
  artisan_winery:             Artisan;
  artisan_lumber:             Artisan;
  artisan_fabric:             Artisan;
  artisan_cement:             Artisan;
  artisan_glass:              Artisan;
  artisan_fertilizer:         Artisan;
  [producer: string]: Template | Factory | RGOTemplate | RGO | Artisan;
}

export interface Template {
  efficiency: { [good: string]: number };
  owner:      OwnerElement;
  employees:  OwnerElement[];
  type:       string;
  workforce:  number;
}

export interface RGOTemplate {
  owner:     Owner;
  employees: OwnerElement[] | OwnerElement;
  type:      string;
  workforce: number;
}

export interface OwnerElement {
  poptype:            string;
  effect:             Effect;
  amount?:            number;
  effect_multiplier?: number;
}

export enum Effect {
  Input = "input",
  Output = "output",
  Throughput = "throughput",
}

export interface Owner {
  poptype: Type;
  effect:  Effect;
}

export enum Type {
  Aristocrats = "aristocrats",
  Artisan = "artisan",
}

export interface Factory {
  template:     string;
  input_goods:  { [good: string]: number };
  output_goods: string;
  value:        number;
  bonus:        Bonus[] | Bonus;
  is_coastal?:  Yes;
}

export interface Bonus {
  trigger: Trigger;
  value:   number;
}

export interface Trigger {
  has_building?: string;
  trade_goods_in_state?: string;
  OR?: Trigger;
}

export interface Artisan {
  input_goods:  { [good: string]: number };
  output_goods: string;
  value:        number;
  owner:        Owner;
  type:         Type;
  workforce:    number;
  is_coastal?:  Yes;
}

export enum Yes {
  Yes = "yes",
}

export enum TemplateEnum {
  RGOTemplateFarmers = "RGO_template_farmers",
  RGOTemplateLabourers = "RGO_template_labourers",
}

export interface RGO {
  template:     TemplateEnum;
  output_goods: string;
  value:        number;
  farm?:        Yes;
  mine?:        Yes;
}

export enum ProductionType {
  FactoryTemplate,
  Factory,
  RGOTemplate,
  RGO,
  Artisan,
}

export function getType(input: Template | Factory | RGOTemplate | RGO | Artisan & any): ProductionType | undefined {
  if (!_.isUndefined(input["efficiency"])) {
      return ProductionType.FactoryTemplate;
    } else if (!_.isUndefined(input["bonus"])) {
      return ProductionType.Factory;
    } else if (!_.isUndefined(input["input_goods"])) {
      return ProductionType.Artisan;
    } else if (!_.isUndefined(input["template"])) {
      return ProductionType.RGO;
    } else if (!_.isUndefined(input["type"])) {
      return ProductionType.RGOTemplate;
    }
}
