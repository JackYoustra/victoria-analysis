import React, {MouseEventHandler, useCallback, useMemo, useState} from "react";
import {directoryOpen} from "browser-fs-access";
import {VickyGameConfiguration} from "../logic/processing/vickyConfiguration";
import {useSave} from "../logic/VickySavesProvider";
import {VickySave} from "../logic/processing/vickySave";
import { parse as v2parser } from "../logic/processing/v2parser";
import RouteBar from "./controller/RouteBar";
import RoutedEditorScreen from "./controller/RoutedEditorScreen";
import {VickyButton} from "../components/VickyButton";
import styled from "styled-components";
import SaveViewer from "./SaveViewer";
import _ from "lodash";
import { saveAs } from 'file-saver';
import {Save} from "../logic/types/save/save";
import {wrap} from "comlink";
import {SaveLoader} from "../logic/processing/loadSaveFromFile";

const Topper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  font-size: calc(10px + 2vmin);
  color: white;
  overflow: hidden;
`;

const SaveLoadedTopper = styled(Topper)`
  justify-content: center;
`;

const SaveButtons = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  transform: scale(50%);
`;

const GameSidebar = styled.div`
  position: fixed;
  top: 50%;
  right: 0;
  /* bring your own prefixes */
  transform: translate(0%, -50%);
  z-index: 1;
`;

function DownloadJSON(props: { save: Save }) {
  return (<VickyButton onClick={
    () => {
      const blob = new Blob([JSON.stringify(props.save, null, 2)], {type: "application/json"});
      saveAs(blob, "save.json");
    }
  }>Download JSON
  </VickyButton>);
}

export default function Home() {
  const vickyContext = useSave();
  const handleClick: MouseEventHandler<HTMLButtonElement> = async event => {
    const blobsInDirectory = await directoryOpen({
      recursive: true,
      skipDirectory: (entry) => entry.name === "mod",
    });
    for (const blob of blobsInDirectory) {
      const extension = blob.name.split('.').pop();
      if (extension === "v2" && blob.directoryHandle?.name.toLowerCase() !== "tutorial") {
        vickyContext.dispatch({ type: "addSave", handle: blob} );
      }
    }
    const config = await VickyGameConfiguration.createSave(blobsInDirectory);
    vickyContext.dispatch({type: "mergeConfiguration", value: config});
  };

  const shouldShowSaveBox = _.isArray(vickyContext.state.saves) && vickyContext.state.saves.length > 0;

  const divItems: React.CSSProperties = vickyContext.state.save ? {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    flexWrap: "wrap",
} : {
    display: "contents"
  };

  const text = useMemo(() => {
    if (!vickyContext.state.saves) {
      return "Load Save folder";
    } else {
      return "Reload folder";
    }
  }, [vickyContext.state.saves]);

  const configText = useMemo(() => {
    if (!vickyContext.state.configuration) {
      return "Load Configuration";
    } else {
      return "Reload Configuration";
    }
  }, [vickyContext.state.configuration]);

  const UsedTopper = vickyContext.state.save ? SaveLoadedTopper : Topper;
  const [selected, setSelected] = useState<number[]>([]);
  const onSelect = useCallback (async (index: number) => {
    const selected = vickyContext.state.saves?.[index];
    if (!_.isUndefined(selected)) {
      const worker = new Worker(new URL('../logic/processing/loadSaveFromFile.ts', import.meta.url));
      const proxy = wrap<SaveLoader>(worker);
      vickyContext.dispatch({type: "loadSave", worker: worker});
      const save = await proxy.loadSaveFromFile(selected.handle);
      vickyContext.dispatch({type: "setSave", value: save});
      setSelected([index]);
    }
  }, [vickyContext]);

  return (
    <UsedTopper>
      <div style={divItems}>
        {vickyContext.state.save && <RouteBar />}
        {vickyContext.state.save && <DownloadJSON  save={vickyContext.state.save.original}/>}
        <img src={"https://vic2.paradoxwikis.com/images/0/0e/V2_wiki_logo.png"} className="App-logo" alt="logo" />
        <SaveButtons>
          <VickyButton onClick={handleClick}> {text} </VickyButton>
          <VickyButton onClick={handleClick}> {configText} </VickyButton>
        </SaveButtons>
      </div>
      {
        vickyContext.state.save &&
        <RoutedEditorScreen/>
      }
      {
        shouldShowSaveBox &&
          <GameSidebar>
              <SaveViewer
                  saves={vickyContext.state.saves?.map(save => [save.handle.name, new Date(save.handle.lastModified)])}
                  onSelect={onSelect}
                  selected={selected}
              />
          </GameSidebar>
      }
    </UsedTopper>
  );
}