import {VickySave} from "./vickySave";
import {VickyGameConfiguration} from "./vickyConfiguration";
import {FileWithDirectoryAndFileHandle} from "browser-fs-access";

export default interface VickyContext {
  readonly saves?: {handle: FileWithDirectoryAndFileHandle}[];
  readonly saveLoader?: Worker;
  readonly save?: VickySave;
  readonly configuration?: VickyGameConfiguration;
}
