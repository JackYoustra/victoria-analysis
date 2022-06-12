import {parseDate} from "../../logic/processing/vickySave";
import _ from "lodash";

export function dateFragment(stringDates: string[], start: Date, end: Date, short?: boolean): string | null {
  const dates = stringDates.map(x => parseDate(x));
  const localized: string[] = [];
  if (dates.length % 2 == 1) {
    localized.push("unknown");
  } else if (dates.length == 2 && dates[0] && dates[1]) {
    // There's only the enterance and exit day, see if they're within range of the start and end
    // Remove (qualify) if within five days
    const acceptanceThreshold = 1000*60*60*24*5;
    const startQualified = ((dates[0].getTime() - start.getTime()) < acceptanceThreshold);
    const endQualified = ((end.getTime() - dates[1].getTime()) < acceptanceThreshold);
    if (startQualified && endQualified) {
      return null;
    } else if (endQualified) {
      return `${localizeDate(dates[0], short)} -`;
    } else if (startQualified) {
      return `- ${localizeDate(dates[1], short)}`;
    }
  }

  return _.chunk(dates, 2).map(chunk => {
    const [entrance, departure] = chunk;
    return entrance + "-" + departure;
  }).join(", ");
}

export function localizeDate(date: Date, short?: boolean): string {
  if (short) {
    return date.toLocaleDateString(navigator.languages[0] ?? "en-US", {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  } else {
    return date.toLocaleDateString(navigator.languages[0] ?? "en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}