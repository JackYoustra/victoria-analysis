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

const styles: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignSelf: "flex-start",
  fontSize: "1rem",
  // justifyContent: "space-around",
  gap: "8pt",
}

const colStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8pt",
  height: "90vh",
  overflow: "auto",
}

async function handleExport({e, props}: any) {
  const image = await (domtoimage.toPng(props.tableRoot) as Promise<Blob>);
  saveAs(image, `${props.name}.png`);
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
    <div style={styles}>
      {/*<SimpleBar style={{ maxHeight: 300 }}>*/}
        <div style={colStyles}>
          {
            wars.map(war => {
              const warView = WarView({ war: war, onHover: useSelectedWar });
              if (war == selectedWar) {
                return (<div style={{border: "inset red", boxSizing: "border-box"}}>
                  {warView}
                </div>)
              } else {
                return warView;
              }
            })
          }
        </div>
      {/*</SimpleBar>*/}
      {/*<SimpleBar style={{ maxHeight: 300 }}>*/}
        <div style={colStyles}>
          {selectedWar ?
            box(selectedWar.history.battle).map(battle => BattleView({ battle: battle }))
            : null}
        </div>
      {/*</SimpleBar>*/}
      <Menu id={contextMenuID}>
        <Item onClick={handleExport}>Save as PNG</Item>
      </Menu>
    </div>
  );
}
