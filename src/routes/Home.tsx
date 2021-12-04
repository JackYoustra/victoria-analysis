import React, {MouseEventHandler} from "react";
import styled from "styled-components";
import {directoryOpen} from "browser-fs-access";
import {VickyGameConfiguration} from "../logic/processing/vickyConfiguration";
import {useSave} from "../logic/VickySavesProvider";
import {VickySave} from "../logic/processing/vickySave";
import { parse as v2parser } from "../logic/processing/v2parser";
import WarsView from "./War/Wars";

const VickyButton = styled.button`
  border-style: groove groove outset groove;
  border-width: medium;
  border-color: palegoldenrod;
  border-radius: 200px;

  background-image: radial-gradient(100% 75% at 50% 100%,
  #819aa2 0%,
  #728496 100%);
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.15), 0 0 5px 5px inset rgba(0, 0, 0, 0.15);
  text-align: center;
  text-decoration: none;
  display: inline-block;
  padding: 0.25em 0.5em;
  font-size: 3rem;
  font-family: "Times New Roman", serif;
  margin: 4px 2px;
  text-shadow: 0 0 1px #fff;

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
        const result = await blob.text();
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

  return (
    <>
      <img src={"https://vic2.paradoxwikis.com/images/0/0e/V2_wiki_logo.png"} className="App-logo" alt="logo" />
      <VickyButton onClick={handleClick}> Choose Victoria 2 Game or Save Folder </VickyButton>
      <input
        type="file"
        // @ts-ignore
        webkitdirectory=""
        // @ts-ignore
        directory=""
        multiple
        ref={hiddenFileInput}
        style={{display: "none"}}
        onChange={(event) => {

          console.log(event.target.files);
        }}
      />
      {
        vickyContext.state.save &&
        <WarsView/>
      }
    </>
  );
}