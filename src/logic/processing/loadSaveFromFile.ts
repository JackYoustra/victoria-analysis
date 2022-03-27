import {parse as v2parser} from "./v2parser";
import {VickySave} from "./vickySave";
import {FileWithDirectoryAndFileHandle} from "browser-fs-access";
import {expose} from "comlink";

export interface SaveLoader {
  loadSaveFromFile(handle: FileWithDirectoryAndFileHandle): Promise<VickySave>;
}

const obj: SaveLoader = {
  async loadSaveFromFile(handle: FileWithDirectoryAndFileHandle): Promise<VickySave> {
    console.log("Loading save from file");
    // Stop here, just parse save file
    const raw = await handle.arrayBuffer();
    // Need to decode as latin1
    const result = new TextDecoder("latin1").decode(raw);
    // @ts-ignore
    const rawOutput = v2parser(result);
    const objectVersion = new VickySave(rawOutput);
    return objectVersion;
  }
};

expose(obj);