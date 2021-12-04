const palette = {
  farmland : [
    0x567C1B,
    0x98D383,
    0x86BF5C,
    0x6FA239,
  ],
  desert : [
    0xCEA963,
    0xE1C082,
    0xF1D297,
    0xAC8843,
  ],
  forest : [
    0x40610C,
    0x274200,
    0x4C5604,
    0x212800,
  ],
  arctic : [
    0xECECEC,
    0xD2D2D2,
    0xB0B0B0,
    0x8C8C8C,
    0x707070,
  ],
  plains : [
    0x750B10,
    0xE72037,
    0xB30B1B,
    0x8A0B1A,
    0x565656,
    0x4E4E4E,
    0x383838,
  ],
  jungle : [
    0x76F5D9,
    0x61DCC1,
    0x38C7A7,
    0x30AF93,
  ],
  mountain : [
    0x100B29,
    0x1A1143,
    0x413479,
    0xB456B3,
    0xB56FB1,
    0xA22753,
    0xC05A75,
    0xD590C7,
    0x2D225F,
    0x7F183C,
    // Insignificant himalayan extras
    0xEBB3E9,
    0xAD3B53,
    0x974831,
    0x66504B,
    0x6F5041,
    0x624F4F,
  ],
  hills : [
    0x2D7792,
    0x4B93AE,
    0xA0D4DC,
    0x78B4CA,
  ],
  woods : [
    0x25607E,
    0x0F3F5A,
    0x06294E,
    0x021429,
  ],
  steppe : [
    0x63070B,
    0x3E0205,
    0x520408,
    0x270002,
  ],
  marsh : [
    0x004939,
    0x025E4A,
    0x1F9A7F,
    0x107A63,
  ],
  ocean : [
    0xFFFFFF,
  ],
};

export const terrainForColor = new Map(Object.entries(palette).flatMap(value => {
  const [terrain, numbers] = value;
  return numbers.map(number => [number, terrain]);
}));