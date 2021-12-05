import React, {MouseEventHandler} from "react";
import styled from "styled-components";
import {directoryOpen} from "browser-fs-access";
import {VickyGameConfiguration} from "../logic/processing/vickyConfiguration";
import {useSave} from "../logic/VickySavesProvider";
import {VickySave} from "../logic/processing/vickySave";
import { parse as v2parser } from "../logic/processing/v2parser";
import WarsView from "./War/Wars";
import RouteBar from "./controller/RouteBar";
import {VickyFrills} from "../styles/VickyFrills";

const VickyButton = styled.button`
  ${VickyFrills};
  
  background-image: radial-gradient(100% 75% at 50% 100%,
  #819aa2 0%,
  #728496 100%);

  border-radius: 200px;

  &:hover {
    cursor: pointer;
    background-image: radial-gradient(100% 75% at 50% 100%,
    #728496 0%,
    #819aa2 100%);
  }

  &:active {
    filter: brightness(85%);
  }
`;

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
  } : {
    display: "contents"
  };

  return (
    <>
      <div style={divItems}>
        {vickyContext.state.save && <RouteBar />}
        <img src={"https://vic2.paradoxwikis.com/images/0/0e/V2_wiki_logo.png"} className="App-logo" alt="logo" />
        <VickyButton onClick={handleClick}> Choose Victoria 2 Game or Save Folder </VickyButton>
      </div>
      {
        vickyContext.state.save &&
        <WarsView/>
      }
    </>
  );
}