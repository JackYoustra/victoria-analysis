import React, {useCallback, useMemo, useRef} from "react";
import {parseDate, ProcessWar} from "../../logic/processing/vickySave";
import {localize} from "../../logic/processing/vickyConfiguration";
import {War} from "../../logic/types/save/save";
import _ from "lodash";
import { localizeDate } from "./wikiFormatters";
import ParticipantElement from "./ParticipantElement";
import CasualtyList from "./CasualtyList";
import {useSave} from "../../logic/VickySavesProvider";
import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import styled from "styled-components";
import {TableItem} from "../../styles/VickyFrills";

const headerStyle: React.CSSProperties = {
  backgroundColor: "#C3D6EF",
  textAlign: "center",
  verticalAlign: "middle",
  fontSize: "110%",
};

interface WarViewProps {
  war: War,
  onHover: (selected: War) => void,
}

export const contextMenuID = "War context menu";

export default function WarView(props: WarViewProps) {
  const { war: war, onHover: onHover } = props;
  const { save, configuration } = useSave().state;

  const mouseOver = () => onHover(war);

  const belligerentTerms = useMemo(() => {
    return ProcessWar(war);
  }, [war]);

  const primaryCause = useMemo(() => {
    const cb = war.original_wargoal.casus_belli;
    if (cb) {
      let name: string | undefined;
      if (war.original_wargoal.state_province_id && save) {
        name = ": " + save.provinces[war.original_wargoal.state_province_id - 1].name;
      } else {
        name = undefined;
      }
      return <TableItem as="tr">
        <TableItem as="th">Primary Cause</TableItem>
        <TableItem style={{wordWrap: "break-word"}}>{localize(cb, configuration) + (name ?? "")}</TableItem>
      </TableItem>;
    }
    return null;
  }, [war]);

  const { show: showContextMenu } = useContextMenu({
    id: contextMenuID,
  });

  const tableRoot = useRef<HTMLDivElement | null>(null);

  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    showContextMenu(event, {
      props: {
        name: war.name,
        tableRoot: tableRoot.current,
      }
    })
  }, []);

  return (
    <div ref={tableRoot} onContextMenu={handleContextMenu} style={{whiteSpace: "pre-wrap"}} onMouseOver={mouseOver}>
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
        verticalAlign: "top",
      }}>
        <tbody style={{
          display: "table-row-group",
          verticalAlign: "middle",
        }}>
        <tr>
          <th colSpan={2} style={headerStyle}>
            {war.name}
          </th>
        </tr>
        <tr>
          <TableItem colSpan={2}>
            <table style={{
              width: "100%",
              margin: 0,
              padding: 0,
              border: 0,
            }}>
              <tbody>
              <TableItem as="tr">
                <TableItem as="th">Date</TableItem>
                <TableItem>{localizeDate(belligerentTerms.start)} - {localizeDate(belligerentTerms.end)}</TableItem>
              </TableItem>
              {/*<tr>*/}
              {/*  <th>Location</th>*/}
              {/*  <td>Look at the provinces for the continents fought on</td>*/}
              {/*</tr>*/}
              {primaryCause}
              {/*<tr>*/}
              {/*  <th>Result</th>*/}
              {/*  <td>Unknown (no information in save file and no heuristics)</td>*/}
              {/*</tr>*/}
              </tbody>
            </table>
          </TableItem>
        </tr>
        <tr>
          <th colSpan={2} style={headerStyle}>Belligerents</th>
        </tr>
        <tr>
          <TableItem style={{display: "table-cell"}}>
            <b>Attackers</b>
            {ParticipantElement({
              configuration,
              terms: belligerentTerms.attacker.term,
              start: belligerentTerms.start,
              end: belligerentTerms.end
            })}
          </TableItem>
          <TableItem>
            <b>Defenders</b>
            {ParticipantElement({
              configuration,
              terms: belligerentTerms.defender.term,
              start: belligerentTerms.start,
              end: belligerentTerms.end
            })}
          </TableItem>
        </tr>
        {/*<tr>*/}
        {/*  <th>Commanders and leaders</th>*/}
        {/*</tr>*/}
        <tr>
          <th colSpan={2} style={headerStyle}>Casualties and losses</th>
        </tr>
        <tr>
          <TableItem>
            <b>Attackers</b>
            {CasualtyList({configuration, losses: belligerentTerms.attacker.losses})}
          </TableItem>
          <TableItem>
            <b>Defenders</b>
            {CasualtyList({configuration, losses: belligerentTerms.defender.losses})}
          </TableItem>
        </tr>
        <TableItem>
          {}
        </TableItem>
        </tbody>
      </table>
    </div>
  )
}