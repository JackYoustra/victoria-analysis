import RouteBar from "../controller/RouteBar";
import {VickyMinorButton} from "../../components/VickyButton";
import React, {MouseEventHandler, useCallback, useMemo} from "react";
import {useSave} from "../../logic/VickySavesProvider";
import styled from "styled-components";
import {directoryOpen} from "browser-fs-access";
import {VickyGameConfiguration} from "../../logic/processing/vickyConfiguration";
import DownloadJSON from "./DownloadJSON";

interface BarItemsProps {
  save?: any,
}

const BarItems = styled.div<BarItemsProps>`
  display: ${props => props.save ? "contents" : "flex"};
  // Makes children 100% of parent. See https://stackoverflow.com/a/32466333/998335
  align-items: stretch;
  overflow: hidden;
  flex: 1 1 auto;
  flex-wrap: wrap;
`;

const SaveButtons = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  font-size: 10%;
`;

const VickyLogo = styled.img`
  width: 10rem;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

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
        dispatch({type: "addSave", handle: blob});
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
    <Spacer/>
    <SaveButtons>
      <VickyLogo src={"https://vic2.paradoxwikis.com/images/0/0e/V2_wiki_logo.png"} alt="Victoria 2 logo"/>
      <VickyMinorButton onClick={handleClickSave}> {text} </VickyMinorButton>
      <VickyMinorButton onClick={handleClickConfig}> {configText} </VickyMinorButton>
    </SaveButtons>
  </BarItems>);
}