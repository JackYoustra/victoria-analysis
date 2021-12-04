import {TermStructure} from "../../logic/processing/vickySave";
import React, {useMemo} from "react";
import {dateFragment} from "./wikiFormatters";

interface ParticipantElementProps {
  terms: TermStructure,
  start: Date,
  end: Date,
}

interface DateFragmentProps extends ParticipantElementProps {
  enterLeaveWarDates: string[],
}

function DateFragment(props: DateFragmentProps) {
  const fragment = useMemo(() => dateFragment(props.enterLeaveWarDates, props.start, props.end), [props.enterLeaveWarDates, props.start, props.end]);
  if (fragment) {
    return (
      <div style={{fontFamily: "serif", fontSize: "0.8rem", fontStyle: "italic"}}>
        {/*<br/>*/}
        {fragment}
      </div>
    );
  }
  return null;
}

export default function ParticipantElement(props: ParticipantElementProps) {
  const { terms: terms } = props;
  const entries = Object.entries(terms);
  return (
    entries.map((value) => {
      const [tag, {inWar, enterLeaveWarDates}] = value;
      return (
        <>
          <br/>
          {tag}
          <DateFragment enterLeaveWarDates={enterLeaveWarDates} {...props} />
        </>
      );
    })
  );
}