import {VickySave} from "./vickySave";
import {VickyGameConfiguration} from "./vickyConfiguration";
import {FileWithDirectoryHandle} from "browser-fs-access";

export default interface VickyContext {
  readonly saves?: {handle: FileWithDirectoryHandle}[];
  readonly save?: VickySave;
  readonly configuration?: VickyGameConfiguration;
}
