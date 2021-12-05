import React, {MouseEventHandler, useMemo} from "react";
import {directoryOpen} from "browser-fs-access";
import {VickyGameConfiguration} from "../logic/processing/vickyConfiguration";
import {useSave} from "../logic/VickySavesProvider";
import {VickySave} from "../logic/processing/vickySave";
import { parse as v2parser } from "../logic/processing/v2parser";
import RouteBar from "./controller/RouteBar";
import RoutedEditorScreen from "./controller/RoutedEditorScreen";
import {VickyButton} from "../components/VickyButton";

export default function Home() {
  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
  const vickyContext = useSave();
  const handleClick: MouseEventHandler<HTMLButtonElement> = async event => {
    const blobsInDirectory = await directoryOpen({
      recursive: true,
    });
    for (const blob of blobsInDirectory) {
      const extension = blob.name.split('.').pop();
      if (extension === "v2") {
        // Stop here, just parse save file
        const raw = await blob.arrayBuffer();
        // Need to decode as latin1
        const result = new TextDecoder("latin1").decode(raw);
        // @ts-ignore
        const rawOutput = v2parser(result);
        const objectVersion = new VickySave(rawOutput);
        vickyContext.dispatch({ type: "setSave", value: objectVersion});
        return;
      }
    }
    const config = await VickyGameConfiguration.createSave(blobsInDirectory);
    vickyContext.dispatch({type: "mergeConfiguration", value: config});
    // hiddenFileInput?.current?.click();
  };

  const divItems: React.CSSProperties = vickyContext.state.save ? {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  } : {
    display: "contents"
  };

  const text = useMemo(() => {
    if (!vickyContext.state.save) {
      return "Load Victoria 2 Save folder";
    } else if (!vickyContext.state.configuration) {
      return "Load Victoria 2 Config folder";
    } else {
      return "Reload folder";
    }
  }, [vickyContext.state]);

  return (
    <>
      <div style={divItems}>
        {vickyContext.state.save && <RouteBar />}
        <img src={"https://vic2.paradoxwikis.com/images/0/0e/V2_wiki_logo.png"} className="App-logo" alt="logo" />
        <VickyButton onClick={handleClick}> {text} </VickyButton>
      </div>
      {
        vickyContext.state.save &&
        <RoutedEditorScreen/>
      }
    </>
  );
}