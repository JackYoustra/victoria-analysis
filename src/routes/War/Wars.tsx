import React, {useState} from "react";
import {useSave} from "../../logic/VickySavesProvider";
import VickyContext from "../../logic/processing/vickyContext";
import {box} from "../../logic/collections/collections";
import {War} from "../../logic/types/save/save";
import BattleView from "./BattleView";
import WarView, {contextMenuID} from "./WarView";
import {Item, Menu} from "react-contexify";
// @ts-ignore
import domtoimage from "dom-to-image-more";
import { saveAs } from 'file-saver';
import {elementToSVG} from "dom-to-svg";
import styled, {css} from "styled-components";

const WarsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-start;
  font-size: 1rem;
  gap: 8pt;
  min-height: 0;
  flex: 1 1 0;
`;

const WarColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8pt;
  overflow: auto;
`;

interface WarBoxProps {
  selected: boolean
}

const WarBox = styled.div<WarBoxProps>`
  ${({ selected }) => selected && css`
    border: inset red;
    box-sizing: border-box;
  `}

  ${({ selected }) => (!selected) && css`
    border: solid rgb(248, 249, 250);
  `}
`;

async function handleExport({e, props}: any) {
  const image = await (domtoimage.toPng(props.tableRoot) as Promise<Blob>);
  saveAs(image, `${props.name}.png`);
}

async function handleExportSVG({e, props}: any) {
  const image = elementToSVG(props.tableRoot);
  const string = new XMLSerializer().serializeToString(image);
  const stringAsBlob = new Blob([string], {type: 'image/svg+xml'});
  saveAs(stringAsBlob, `${props.name}.svg`);
}

export default function WarsView() {
  const vickyContext: VickyContext = useSave().state;
  const [selectedWar, useSelectedWar] = useState<War | undefined>(undefined);
  if (!vickyContext.save) {
    return (
      <>
        Please upload a save to view war information.
      </>
    )
  }
  const wars = box(vickyContext.save?.original.previous_war).concat(box(vickyContext.save?.original.active_war));
  return (
    <WarsContainer>
      <WarColumn>
        {
          wars.map(war => {
            return (
              <WarBox selected={war === selectedWar}>
                <WarView war={war} onHover={useSelectedWar}/>
              </WarBox>
            );
          })
        }
      </WarColumn>
      <WarColumn>
        {selectedWar ?
          box(selectedWar.history.battle).map(battle => <BattleView battle={battle} />)
          : null}
      </WarColumn>
      <Menu id={contextMenuID}>
        <Item onClick={handleExport}>Save as PNG</Item>
        <Item onClick={handleExportSVG}>Save as SVG</Item>
      </Menu>
    </WarsContainer>
  );
}
