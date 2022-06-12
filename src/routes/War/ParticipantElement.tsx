import {TermStructure} from "../../logic/processing/vickySave";
import React, {useMemo} from "react";
import {dateFragment} from "./wikiFormatters";
import {localize, VickyGameConfiguration} from "../../logic/processing/vickyConfiguration";
import styled from "styled-components";

const DateEntryExitElement = styled.span`
  font-family: "serif";
  font-size: 0.8rem;
  font-style: italic;
  padding-left: 0.4rem;
`;

interface ParticipantElementProps {
  configuration?: VickyGameConfiguration,
  terms: TermStructure,
  start: Date,
  end: Date,
}

interface DateFragmentProps extends ParticipantElementProps {
  enterLeaveWarDates: string[],
}

function DateFragment(props: DateFragmentProps) {
  const fragment = useMemo(() => dateFragment(props.enterLeaveWarDates, props.start, props.end, true), [props.enterLeaveWarDates, props.start, props.end]);
  if (fragment) {
    return (
      <DateEntryExitElement>
        {`(${fragment})`}
      </DateEntryExitElement>
    );
  }
  return null;
}

export default function ParticipantElement(props: ParticipantElementProps) {
  const { terms, configuration } = props;
  const entries = Object.entries(terms);
  return (
    entries.map((value) => {
      const [tag, {inWar, enterLeaveWarDates}] = value;
      return (
        <>
          <br/>
          {localize(tag, configuration)}
          <DateFragment enterLeaveWarDates={enterLeaveWarDates} {...props} />
        </>
      );
    })
  );
}