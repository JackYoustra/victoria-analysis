import {Battle, Combatant} from "../../logic/types/save/save";
import React, {useCallback, useRef} from "react";
import {useSave} from "../../logic/VickySavesProvider";
import _ from "lodash";
import {localize, VickyGameConfiguration} from "../../logic/processing/vickyConfiguration";
import {TableItem} from "../../styles/VickyFrills";
import {useContextMenu} from "react-contexify";
import {contextMenuID} from "./WarView";

function EquipmentView(combatant: Combatant, configuration?: VickyGameConfiguration) {
  const engaged = Object.entries(combatant).filter(entry => _.isNumber(entry[1]) && entry[0] !== "losses") as [string, number][];
  const strings = engaged.sort((a, b) => a[1] - b[1])
    .map(entry => {
      const [unitName, engagedStrength] = entry as [string, number];
      const text = `${localize(unitName, configuration)} - ${engagedStrength.toLocaleString()}`;
      return text;
    }
  ).join("\n");

  return (
    strings
  );
}

const headerStyle: React.CSSProperties = {
  backgroundColor: "#C3D6EF",
  textAlign: "center",
  verticalAlign: "middle",
  fontSize: "110%",
};

interface BattleViewProps {
  battle: Battle,
}

export default function BattleView(props: BattleViewProps) {
  const { battle } = props;
  const { save, configuration } = useSave().state;
  const province_id = battle.location - 1;
  const provinceName = save?.provinces[province_id].name;
  const attacker = localize(battle.attacker.country, configuration);
  const defender = localize(battle.defender.country, configuration);

  const { show: showContextMenu } = useContextMenu({
    id: contextMenuID,
  });

  const tableRoot = useRef<HTMLDivElement | null>(null);

  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    showContextMenu(event, {
      props: {
        name: battle.name,
        tableRoot: tableRoot.current,
      }
    })
  }, [showContextMenu, battle.name, tableRoot]);

  return (
    <div ref={tableRoot} onContextMenu={handleContextMenu} style={{whiteSpace: "pre-wrap"}}>
      <table style={{
        fontFamily: "sans-serif",
        border: "1px",
        borderSpacing: "3px",
        backgroundColor: "#f8f9fa",
        color: "black",
        // margin: 0.5em 0 0.5em 1em,
        padding: "0.2em",
        // float: "right",
        // clear: "right",
        fontSize: "88%",
        lineHeight: "1.5em",
        width: "22em",
      }}>
        <tbody style={{
          display: "table-row-group",
          verticalAlign: "middle",
        }}>
        <tr>
          <th colSpan={2} style={headerStyle}>
            {"Battle of " + battle.name}
            <br/>
            {attacker + " attacking " + defender}
          </th>
        </tr>
        <tr>
          <td colSpan={2}>
            <table style={{
              width: "100%",
              margin: 0,
              padding: 0,
              border: 0,
            }}>
              <tbody>
              <TableItem as="tr">
                <TableItem as="th">Location</TableItem>
                <TableItem>{provinceName}</TableItem>
              </TableItem>
              <TableItem as="tr">
                <TableItem as="th">Result</TableItem>
                <TableItem>{battle.result === "yes" ? attacker : defender} Victory</TableItem>
              </TableItem>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <th colSpan={2} style={headerStyle}>Belligerents</th>
        </tr>
        <tr>
          <TableItem style={{display: "table-cell"}}>
            <b>Attackers</b>
            <br/>
            {battle.attacker.leader}
            <br/>
            {EquipmentView(battle.attacker, configuration)}
          </TableItem>
          <TableItem>
            <b>Defenders</b>
            <br/>
            {battle.defender.leader}
            <br/>
            {EquipmentView(battle.defender, configuration)}
          </TableItem>
        </tr>
        <tr>
          <th colSpan={2} style={headerStyle}>Casualties and losses</th>
        </tr>
        <tr>
          <TableItem>
            <b>Attackers</b>
            <br/>
            {battle.attacker.losses.toLocaleString()}
          </TableItem>
          <TableItem>
            <b>Defenders</b>
            <br/>
            {battle.defender.losses.toLocaleString()}
          </TableItem>
        </tr>
        </tbody>
      </table>
    </div>
  )
}