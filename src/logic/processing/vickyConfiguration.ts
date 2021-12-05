import Image from "image-js";
import {TerrainInfo} from "../types/configuration/vickyTerrainDefinition";
import _ from "lodash";
import {terrainForColor} from "../priors/TerrainPalette";
import {FileWithDirectoryHandle} from "browser-fs-access";
import { parse as v2parser } from "./v2parser";
import Papa, {ParseResult} from "papaparse";
// @ts-ignore
import TGA from "tga";
import { useSave } from "../VickySavesProvider";
import { Country } from "../types/save/vickyCountryDefinition";
import {lower} from "../collections/collections";

export interface ProvinceDefinition {
  // The numeric province ID associated with the province
  province: number,
  red: number,
  green: number,
  blue: number,
  name: string,
}

interface ProvinceLookup {
  [color_hex: number]: ProvinceDefinition | undefined
}

export function rgbToHex(array: number[]): number {
  const [r, g, b] = array;
  return ((r << 16) | (g << 8) | b);
}

function makeProvinceLookup(definitions: ProvinceDefinition[]): ProvinceLookup {
  const retVal = definitions.map((definition, index, array) => {
    const hex = rgbToHex([definition.red, definition.green, definition.blue]);
    return [hex, definition]
  });
  return Object.fromEntries(retVal);
}

// Returns a lookup from the ID to the terrain
function makeTerrainLookup(provinceMap: Image, terrainMap: Image, provinceLookup: ProvinceLookup, terrainInfo: TerrainInfo): Map<number, string> {
  // Terrain color is a red herring, use the palette file
  // const terrainColorLookup: Map<number[], string> = new Map(Object.entries(terrainInfo.categories).map(entry => {
  //   const [key, value] = entry;
  //   return [value.color, key];
  // }));

  // Find majority terrain in color
  // Take the min of both and only compute for overlapping segments
  const width = Math.min(provinceMap.width, terrainMap.width);
  const height = Math.min(provinceMap.height, terrainMap.height);

  // Province colors to count of terrain color occurances
  const provinceColorsToTerrainColors = new Map<number[], Map<number[], number>>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const terrainWithAlpha = terrainMap.getPixelXY(x, y);
      // dump alpha channel
      const terrain = terrainWithAlpha.slice(0, 3);
      const provinceWithAlpha = provinceMap.getPixelXY(x, y);
      const province = provinceWithAlpha.slice(0, 3);
      let provinceToTerrainColors = provinceColorsToTerrainColors.get(province);
      // Set if province is missing
      if (_.isUndefined(provinceToTerrainColors)) {
        provinceToTerrainColors = new Map();
        provinceColorsToTerrainColors.set(province, provinceToTerrainColors);
      }
      // Check if terrain color is missing
      let terrainColorCount = provinceToTerrainColors.get(terrain);
      if (_.isUndefined(terrainColorCount)) {
        terrainColorCount = 0;
      }
      provinceToTerrainColors.set(terrain, terrainColorCount + 1);
    }
  }

  const terrainLookup = new Map<number, string>();

  // @ts-ignore
  for (const [key, value] of provinceColorsToTerrainColors) {
    let maxCount = 0;
    let maxTerrain: number[] | undefined = undefined;
    for (const [terrain, count] of value) {
      if (count > maxCount) {
        maxCount = count;
        maxTerrain = terrain;
      }
    }

    if (_.isUndefined(maxTerrain)) {
      continue;
    }

    const terrainColorHex = rgbToHex(maxTerrain);
    const lookedUp = terrainForColor.get(terrainColorHex);
    if (_.isUndefined(lookedUp)) {
      continue;
    }

    const province = provinceLookup[rgbToHex(key)];
    if (_.isUndefined(province)) {
      continue;
    }
    terrainLookup.set(province.province, lookedUp);
  }
  return terrainLookup;
}

interface URLCachedImage {
  original: Image;
  url: string;
}

async function makeTargaImage(fileDirectoryHandle: FileWithDirectoryHandle): Promise<string | undefined> {
  const tga = new TGA(new Buffer(await fileDirectoryHandle.arrayBuffer()));
  const image = new Image(tga.width, tga.height, tga.pixels, {
    // @ts-ignore
    colorModel: 'RGB',
    bitDepth: 8,
    alpha: 1,
  })

  return image.toDataURL();
}

export async function makeTerrainImage(configuration: VickyGameConfiguration, province: number): Promise<string | undefined> {
  const terrainType = configuration.terrainLookup?.get(province);
  if (_.isUndefined(terrainType)) {
    return undefined;
  }
  const fileDirectoryHandle = configuration.terrainSources?.get(terrainType);
  if (_.isUndefined(fileDirectoryHandle)) {
    return undefined;
  }
  return makeTargaImage(fileDirectoryHandle);
}

export async function makeFlagImage(configuration: VickyGameConfiguration, tag: string): Promise<string | undefined> {
  const fileDirectoryHandle = configuration.flagSources?.get(tag);
  if (_.isUndefined(fileDirectoryHandle)) {
    return undefined;
  }
  return makeTargaImage(fileDirectoryHandle);
}

const terrainImageTest = new RegExp('^terrain_([a-zA-Z]+)\\.tga$');
const flagTest = new RegExp('^[A-Z]{3,}(?:_[a-zA-Z]+)?\\.tga$');

export interface Localisation {
  // english?: string,
  [language: string]: string,
}

// eslint-disable-next-line react-hooks/rules-of-hooks
export function localize(key: string, configuration: VickyGameConfiguration | undefined): string {
  return VickyGameConfiguration.localizeToConfiguration(configuration, key);
}

type CountryLocalisation = { [tag: string]: string };
type LocalizationKeys = { [localizationKey: string]: CountryLocalisation };
export class VickyGameConfiguration {
  // Source files of flags
  flagSources?: Map<string, FileWithDirectoryHandle>;
  // Sources of terrain images, from terrain type
  terrainSources?: Map<string, FileWithDirectoryHandle>;
  // Localisation key to localisation language object
  localisationSet?: { [key: string]: Localisation | undefined };
  // Ideology to ideology object map
  ideologies?: any;
  provinceMap?: URLCachedImage;
  // Map of province ID to terrain type
  terrainLookup?: Map<number, string>;
  // Hex definition to the color of the province
  provinceLookup?: ProvinceLookup;
  countries?: { [fullname: string]: Country };
  poptypes?: { [poptype: string]: any }

  private constructor(flagSources?: Map<string, FileWithDirectoryHandle>, terrainSources?: Map<string, FileWithDirectoryHandle>, localisationSet?: any, ideologies?: any, provinceMap?: URLCachedImage, terrainLookup?: Map<number, string>, provinceLookup?: ProvinceLookup, countries?: any, poptypes?: { [poptype: string]: any }) {
    this.flagSources = flagSources;
    this.terrainSources = terrainSources;
    this.localisationSet = localisationSet;
    this.ideologies = ideologies;
    this.provinceMap = provinceMap;
    this.terrainLookup = terrainLookup;
    this.provinceLookup = provinceLookup;
    this.countries = countries;
    this.poptypes = poptypes;
  }

  static async parseV2(fileDirectoryHandle: FileWithDirectoryHandle): Promise<any> {
    // @ts-ignore
    return v2parser(await fileDirectoryHandle.text());
  }

  static async makeIdeologies(fileDirectoryHandle: FileWithDirectoryHandle): Promise<any> {
    const ideologyText = await fileDirectoryHandle.text()
    // @ts-ignore
    const ideologyData = v2parser(ideologyText);
    return lower(ideologyData, "group");
  }

  static async makeImage(fileDirectoryHandle: FileWithDirectoryHandle): Promise<URLCachedImage> {
    const image = await fileDirectoryHandle.arrayBuffer().then(Image.load);
    // @ts-ignore
    image.flipY();
    return {
      original: image,
      url: image.toDataURL(),
    };
  }

  static async makeMap(fileDirectoryHandle: FileWithDirectoryHandle): Promise<URLCachedImage> {
    const middleMapImage = await fileDirectoryHandle.arrayBuffer().then(Image.load);
    // @ts-ignore
    middleMapImage.flipY();
    return {
      original: middleMapImage,
      url: middleMapImage.toDataURL(),
    };
  }

  // Returns promise of country definitions and their localisations
  static async makeCountries(fileDirectoryHandle: FileWithDirectoryHandle, directory: FileWithDirectoryHandle[]): Promise<[any, CountryLocalisation]> {
    const countries = await fileDirectoryHandle.text();
    const mapper = new Map<string, string>();
    // @ts-ignore
    const parsed = v2parser(countries);
    const localisations: CountryLocalisation = {}
    // Make paths absolute
    const countriesTest = new RegExp('^countries/');
    for (const key in parsed) {
      if (parsed.hasOwnProperty(key)) {
        const countryCleaned = parsed[key].replace(countriesTest, "");
        parsed[key] = countryCleaned;
        mapper.set(countryCleaned, key);
      }
    }
    for (const fileDirectoryHandle of directory) {
      const tag = mapper.get(fileDirectoryHandle.name);
      if (tag) {
        // Yay! Replace with country definition, add name to localisation list
        localisations[tag] = parsed[tag];
        // @ts-ignore
        parsed[tag] = v2parser(await fileDirectoryHandle.text());
      }
    }
    return [parsed, localisations];
  }

  static makeLocalization(fileDirectoryHandle: FileWithDirectoryHandle): Promise<LocalizationKeys> {
    const dankness = new Promise((complete, error) => {
      // @ts-ignore
      Papa.parse(fileDirectoryHandle, {
        header: false, // headers overwrite
        complete(results: ParseResult<[string, string, string, string, string | undefined, string]>, file?: File) {
          let localisationGroup: LocalizationKeys = {}
          for (const localisation of results.data) {
            const [key, english, french, german, unknown, spanish] = localisation;
            if (key.trim().length > 0) {
              localisationGroup[key] = {
                "english": english,
                "french": french,
                "german": german,
                "spanish": spanish,
              }
            }
          }
          complete(localisationGroup);
        },
        error,
      });
    });
    return dankness as Promise<LocalizationKeys>;
  }

  public static localizeToConfiguration(configuration: VickyGameConfiguration | undefined, key: string): string {
    const object = configuration?.localisationSet;
    if (!object) {
      return key;
    }
    const localisation = object[key];
    if (!localisation) {
      return key;
    }
    if (localisation.english) {
      return localisation.english;
    } else {
      const values = Object.values(localisation);
      if (values.length > 0) {
        return values[0];
      } else {
        return key;
      }
    }
  }

  public static async createSave(saveDirectory: FileWithDirectoryHandle[]): Promise<VickyGameConfiguration> {
    let promises: (Promise<any> | null)[] = Array(6).fill(null);

    let localisations: [Promise<any>, FileWithDirectoryHandle][] = [];
    let flagFiles = new Map<string, FileWithDirectoryHandle>();
    let terrainInterfaceImageFiles = new Map<string, FileWithDirectoryHandle>();
    let poptypes: { [poptype: string]: any } = {};
    for (const fileDirectoryHandle of saveDirectory) {
      console.log("Found " + fileDirectoryHandle.name);
      if (fileDirectoryHandle.name == "ideologies.txt") {
        console.log("Found ideologies");
        promises[0] = this.makeIdeologies(fileDirectoryHandle);
      } else if (fileDirectoryHandle.name == "provinces.bmp") {
        // Province locations and colors
        console.log("Found map");
        promises[1] = this.makeMap(fileDirectoryHandle);
      } else if (fileDirectoryHandle.name == "terrain.bmp") {
        // Province locations and colors
        console.log("Found terrain");
        promises[2] = this.makeImage(fileDirectoryHandle);
      } else if (fileDirectoryHandle.name == "definition.csv") {
        console.log("Found province definitions");
        // Province definition
        promises[3] = new Promise<ProvinceDefinition[]>((complete, error) => {
          // @ts-ignore
          Papa.parse(fileDirectoryHandle, {
            header: false, // headers overwrite
            complete(results: ParseResult<[string, string, string, string, string, 'x']>, file?: File) {
              const result = results.data.map((current, index, array) => {
                const [province, r, g, b, provinceName] = current;
                return {
                  province: parseInt(province),
                  red: parseInt(r),
                  green: parseInt(g),
                  blue: parseInt(b),
                  name: provinceName,
                }
              });
              complete(result);
            },
            error,
          });
        });
      } else if (fileDirectoryHandle.name == "countries.txt") {
        console.log("Found country definitions");
        promises[4] = this.makeCountries(fileDirectoryHandle, saveDirectory);
      } else if (fileDirectoryHandle.name == "terrain.txt") {
        console.log("Found terrain definitions");
        promises[5] = this.parseV2(fileDirectoryHandle);
      } else if (fileDirectoryHandle.directoryHandle?.name.includes("localisation")) {
        localisations.push([this.makeLocalization(fileDirectoryHandle), fileDirectoryHandle]);
      } else if (flagTest.test(fileDirectoryHandle.name)) {
        flagFiles.set(fileDirectoryHandle.name.substring(0, fileDirectoryHandle.name.length - 4), fileDirectoryHandle);
      } else if (fileDirectoryHandle.directoryHandle?.name.includes("poptypes")) {
        // @ts-ignore
        poptypes[fileDirectoryHandle.name] = v2parser(await fileDirectoryHandle.text());
      } else {
        const match = fileDirectoryHandle.name.match(terrainImageTest);
        if (!_.isNull(match)) {
          const terrainName = match[1];
          // Could check to see if we need it, but may've not read it yet so just retrieve all terrains
          terrainInterfaceImageFiles.set(terrainName, fileDirectoryHandle);
        }
      }
    }

    console.log(flagFiles);

    localisations.sort(([{}, a], [{}, b]) => a.name.localeCompare(b.name));
    let localisationSet = {};
    for (const [localisation, {}] of localisations) {
      try {
        _.assign(localisationSet, await localisation);
      } catch (error) {
        console.log("Error assigning stuff, I'm stuff, so is " + error);
      }
    }
    console.log(localisationSet);

    for (const promise of promises) {
      promise?.catch(reason => {
        console.error("Error loading: " + reason);
      })
    }
    const results = await Promise.allSettled(promises.map(x => x ?? Promise.reject("Can't find")));

    const [ideologyText, rawMapImage, rawTerrainImage, provinceDefinitionsMaybe, countriesMaybe, terrainDefinitionsMaybe] = results;
    let ideologies: any | undefined = undefined;
    let mapImage: URLCachedImage | undefined = undefined;
    let provinceLookup: ProvinceLookup | undefined = undefined;
    let countries: any | undefined = undefined;
    let countryLocalisations: CountryLocalisation | undefined = undefined;
    let filledTerrainImage: URLCachedImage | undefined;
    let terrainInfo: TerrainInfo | undefined = undefined;
    let terrainLookup: Map<number, string> | undefined = undefined;
    if (ideologyText.status == "fulfilled") {
      ideologies = ideologyText;
    }
    if (countriesMaybe.status == "fulfilled") {
      const [countriesValue, countryLocalisationsValue] = countriesMaybe.value;
      countries = countriesValue;
      countryLocalisations = countryLocalisationsValue;
    }
    if (rawMapImage.status == "fulfilled") {
      mapImage = rawMapImage.value;
    }
    if (rawTerrainImage.status == "fulfilled") {
      filledTerrainImage = rawTerrainImage.value;
    }
    if (terrainDefinitionsMaybe.status == "fulfilled") {
      terrainInfo = terrainDefinitionsMaybe.value;
    }
    if (provinceDefinitionsMaybe.status == "fulfilled" && provinceDefinitionsMaybe.value) {
      let provinceDefinitions = provinceDefinitionsMaybe.value;
      provinceLookup = makeProvinceLookup(provinceDefinitions);
    }
    if (filledTerrainImage && mapImage && provinceLookup && terrainInfo) {
      // make both
      terrainLookup = makeTerrainLookup(mapImage.original, filledTerrainImage.original, provinceLookup, terrainInfo);
    }
    // const localisationLanguages = swapPrimaryKey(localisationSet);
    return new VickyGameConfiguration(flagFiles.size == 0 ? undefined : flagFiles,
      terrainInterfaceImageFiles.size == 0 ? undefined : terrainInterfaceImageFiles,
      localisationSet,
      ideologies,
      mapImage,
      terrainLookup,
      provinceLookup,
      countries,
      poptypes);
  }
}