import {Save} from "../../logic/types/save/save";
import {saveAs} from "file-saver";
import React, {useCallback} from "react";
import {ButtonElement, TitleHeader, TopEmoji} from "./BarStyles";

export default function DownloadJSON(props: { save: Save }) {
  const downloader = useCallback(
    () => {
      const blob = new Blob([JSON.stringify(props.save, null, 2)], {type: "application/json"});
      saveAs(blob, "save.json");
    }, [props.save]);
  return (
      <ButtonElement onClick={downloader}>
        <TitleHeader>
          <TopEmoji>
            📜
          </TopEmoji>
          JSON
        </TitleHeader>
      </ButtonElement>
  );
}