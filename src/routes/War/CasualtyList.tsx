import {LossesType} from "../../logic/processing/vickySave";
import React from "react";
import {localize, VickyGameConfiguration} from "../../logic/processing/vickyConfiguration";

interface CasualtyListProps {
  configuration?: VickyGameConfiguration,
  losses: LossesType,
}

export default function CasualtyList(props: CasualtyListProps) {
  const { configuration, losses } = props;

  // Largest first
  const lossList: [string, string, number][] = Object.entries(losses).flatMap(tuple => {
    const [country, leaders] = tuple;
    const retVal: [string, string, number][] = Object.entries(leaders).map(x => {
      const [leader, loss] = x;
      return [country, leader, loss];
    });
    return retVal;
  });
  const sorted = lossList
    .filter(x => x[2] !== 0)
    .sort(((a, b) => b[2] - a[2]));
  const text = sorted.map(x => {
    const battleTitle = `${x[2].toLocaleString()} from ${localize(x[0], configuration)}`;
    // Sometimes, the leader name can be empty (No Leader). Not undefined, not "No Leader", just empty. Thx Paradox.
    if (x[1].length > 0) {
      return `${battleTitle} (led by ${x[1]})`;
    } else {
      return `${battleTitle} (No leader!)`;
    }
  }).join("\n");
  const total = `Total: ${lossList.reduce((previousValue, currentValue) => previousValue + currentValue[2], 0).toLocaleString()}`;
  return (
    // https://stackoverflow.com/a/60909422
    <>
      <br/>
      {text}
      <br/>
      <b>
        {total}
      </b>
    </>
  )
}

