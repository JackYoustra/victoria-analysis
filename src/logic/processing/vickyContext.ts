import {VickySave} from "./vickySave";
import {VickyGameConfiguration} from "./vickyConfiguration";

export default interface VickyContext {
  readonly save?: VickySave;
  readonly configuration?: VickyGameConfiguration;
}
