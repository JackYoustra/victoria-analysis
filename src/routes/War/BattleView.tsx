import {Battle, Combatant} from "../../logic/types/save/save";
import React from "react";
import VickyContext from "../../logic/processing/vickyContext";
import {useSave} from "../../logic/VickySavesProvider";
import _ from "lodash";

function EquipmentView(combatant: Combatant) {
  const engaged = Object.entries(combatant).filter(entry => _.isNumber(entry[1]) && entry[0] != "losses") as [string, number][];
  const strings = engaged.sort((a, b) => a[1] - b[1])
    .map(entry => {
      const [unitName, engagedStrength] = entry as [string, number];
      const text = `${unitName} - ${engagedStrength.toLocaleString()}`;
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
  const { battle: battle } = props;
  const vickyContext: VickyContext = useSave().state;
  const province_id = battle.location - 1;
  const provinceName = vickyContext.save?.provinces[province_id].name;
  return (
    <div style={{whiteSpace: "pre-wrap"}}>
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
            {battle.attacker.country + " attacking " + battle.defender.country}
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
              <tr>
                <th>Location</th>
                <td>{provinceName}</td>
              </tr>
              <tr>
                <th>Result</th>
                <td>{battle.result == "yes" ? battle.attacker.country : battle.defender.country} Victory</td>
              </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <th colSpan={2} style={headerStyle}>Belligerents</th>
        </tr>
        <tr>
          <td style={{display: "table-cell"}}>
            <b>Attackers</b>
            <br/>
            {battle.attacker.leader}
            <br/>
            {EquipmentView(battle.attacker)}
          </td>
          <td>
            <b>Defenders</b>
            <br/>
            {battle.defender.leader}
            <br/>
            {EquipmentView(battle.defender)}
          </td>
        </tr>
        <tr>
          <th colSpan={2} style={headerStyle}>Casualties and losses</th>
        </tr>
        <tr>
          <td>
            <b>Attackers</b>
            <br/>
            {battle.attacker.losses.toLocaleString()}
          </td>
          <td>
            <b>Defenders</b>
            <br/>
            {battle.defender.losses.toLocaleString()}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}