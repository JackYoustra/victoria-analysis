// type TextKey = `test_${number}`;

export interface TerrainInfo {
  terrain:    number;
  categories: Categories;
  ocean1:     Ocean1;
  // In the form text_(some number)
  // This is where the terrain.bmp color is specified
  // [text: TextKey]: Text;

  // Permanent terra incognita.
  // Not actually used, just a spot for unused terrain.bmp textures
  pti:        Ocean1;
}

export interface Categories {
  [text: string]: Terrain;
}

export interface Terrain {
  movement_cost:      number;
  // Not the color in terrain.bmp, probably just used elsewhere somewhere
  color:              [number, number, number];
  farm_rgo_size?:      string;
  farm_rgo_eff?:       string;
  mine_rgo_size?:      string;
  mine_rgo_eff?:       string;
  supply_limit?:      number;
  defence?:            number;
  combat_width?:       string;
  min_build_railroad?: number;
  is_water?:      "yes";
}

export interface Ocean1 {
  type:        string;
  color:       number[];
  has_texture: string;
}

export interface Text {
  type:     string;
  color:    number[];
  priority: number;
}
