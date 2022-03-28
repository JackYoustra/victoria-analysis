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
import TopBar from "./TopBar";

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

const GameSidebar = styled.div`
  position: fixed;
  top: 50%;
  right: 0;
  /* bring your own prefixes */
  transform: translate(0%, -50%);
  z-index: 1;
`;

export default function Home() {
  const vickyContext = useSave();

  const shouldShowSaveBox = _.isArray(vickyContext.state.saves) && vickyContext.state.saves.length > 0;

  const UsedTopper = vickyContext.state.save ? SaveLoadedTopper : Topper;
  const [selected, setSelected] = useState<number[]>([]);
  const onSelect = useCallback (async (index: number) => {
    const selected = vickyContext.state.saves?.[index];
    if (!_.isUndefined(selected)) {
      const worker = new Worker(new URL('../logic/processing/loadSaveFromFile.ts', import.meta.url));
      const proxy = wrap<SaveLoader>(worker);
      vickyContext.dispatch({type: "loadSave", worker: worker});
      setSelected([index]);
      const save = await proxy.loadSaveFromFile(selected.handle);
      vickyContext.dispatch({type: "setSave", value: save});
    }
  }, [vickyContext]);

  return (
    <UsedTopper>
      <TopBar/>
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
                  loading={vickyContext.state.saveLoader !== undefined}
              />
          </GameSidebar>
      }
    </UsedTopper>
  );
}