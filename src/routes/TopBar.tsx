import RouteBar from "./controller/RouteBar";
import {VickyButton} from "../components/VickyButton";
import React, {MouseEventHandler, useCallback, useMemo} from "react";
import {useSave} from "../logic/VickySavesProvider";
import styled from "styled-components";
import {directoryOpen} from "browser-fs-access";
import {VickyGameConfiguration} from "../logic/processing/vickyConfiguration";
import {Save} from "../logic/types/save/save";
import {saveAs} from "file-saver";

interface BarItemsProps {
  save?: any,
}

const BarItems = styled.div<BarItemsProps>`
  display: ${props => props.save ? "contents" : "flex"};
  align-items: center;
  overflow: hidden;
  flex-wrap: wrap;
`;

const SaveButtons = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  transform: scale(50%);
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

export default function TopBar() {
  const {state, dispatch} = useSave();

  const handleClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    const blobsInDirectory = await directoryOpen({
      recursive: true,
      startIn: "documents",
      id,
      skipDirectory: (entry) => entry.name === "mod",
    });
    for (const blob of blobsInDirectory) {
      const extension = blob.name.split('.').pop();
      if (extension === "v2" && blob.directoryHandle?.name.toLowerCase() !== "tutorial") {
        dispatch({ type: "addSave", handle: blob} );
      }
    }
    const config = await VickyGameConfiguration.createSave(blobsInDirectory);
    dispatch({type: "mergeConfiguration", value: config});
  }, [state, dispatch]);

  const handleClickSave: MouseEventHandler<HTMLButtonElement> = useCallback(async event => {
    await handleClick(event, "save");
  }, [handleClick]);

  const handleClickConfig: MouseEventHandler<HTMLButtonElement> = useCallback(async event => {
    await handleClick(event, "config");
  }, [handleClick]);

  const text = useMemo(() => {
    if (!state.saves) {
      return "Load Save folder";
    } else {
      return "Reload folder";
    }
  }, [state.saves]);

  const configText = useMemo(() => {
    if (!state.configuration) {
      return "Load Configuration";
    } else {
      return "Reload Configuration";
    }
  }, [state.configuration]);

  return (<BarItems>
    {state.save && <RouteBar/>}
    {state.save && <DownloadJSON save={state.save.original}/>}
    <img src={"https://vic2.paradoxwikis.com/images/0/0e/V2_wiki_logo.png"} className="App-logo" alt="logo"/>
    <SaveButtons>
      <VickyButton onClick={handleClickSave}> {text} </VickyButton>
      <VickyButton onClick={handleClickConfig}> {configText} </VickyButton>
    </SaveButtons>
  </BarItems>);
}