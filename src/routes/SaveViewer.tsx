import styled from "styled-components";
import {VickyText} from "../styles/VickyFrills";
import {useCallback, useState} from "react";

export interface SaveViewerProps {
  selected?: number[];
  saves?: [string, Date][];
  onSelect?: (index: number) => void;
}

const SaveTable = styled.div`
  border-style: ridge;
  border-width: 1pt;
  border-color: palegoldenrod;
  background-color: rgba(0, 0, 0, 0.5);

  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: start;
  overflow: auto;
  max-height: 100vh;
`;

const SaveRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  color: white;
`;

const TitleRow = styled(SaveRow)`
  background-color: rgba(45, 19, 25, 0.5);
  border-style: solid;
  border-width: 1pt;
  border-color: black;
  font-weight: bold;
  padding-left: 8pt;
  margin: 2pt;
  cursor: pointer;
`;

const SubtitleRow = styled(SaveRow)`
  font-size: 0.5em;
  padding-left: 10pt;
  padding-right: 10pt;
`;

interface SaveLoadButtonProps {
  selected?: boolean;
}

const SaveLoadButton = styled.button<SaveLoadButtonProps>`
  ${VickyText};
  background-color: ${props => props.selected ? "rgba(100%, 100%, 100%, 0.25)" : "transparent"};
  border-width: 0;

  padding-left: 10pt;
  padding-right: 10pt;

  display: block;
  width: 100%;
  
  &:hover {
    background-color: ${props => props.selected ? "rgba(100%, 100%, 100%, 0.25)" : "rgba(0, 0, 0, 0.3)" };
    filter: ${props => props.selected ? "none" : "invert(100%)"};
  }
`;

const SaveList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin: 0;
`;

const CollapsedButton = styled.button`
  ${VickyText};
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.15), 0 0 5px 5px inset rgba(0, 0, 0, 0.15);
  display: block;
  padding: 0px;
  border: 0;
  background: transparent;
  font-size: larger;
  cursor: pointer;

  &:hover {
    filter: invert(10%);
  }
`;

const SavesHeader = styled.p`
  ${VickyText};
  font-size: 1.0em;
  font-weight: bold;
  margin-bottom: 0;
  margin-top: 0;
`;

const HeaderButton = styled.p`
  ${VickyText};
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 0;
  margin-top: 0;
`;

export default function SaveViewer(props: SaveViewerProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [sortOnName, setSortOnName] = useState(true);

  const sorter = useCallback((a: [string, Date], b: [string, Date]) => {
    if (sortOnName) {
      return a[0].localeCompare(b[0]);
    } else {
      return b[1].getTime() - a[1].getTime();
    }
  }, [sortOnName]);

  if (collapsed) {
    return <CollapsedButton onClick={() => setCollapsed(false)}>💾</CollapsedButton>;
  }

  return (
    <SaveTable>
      <TitleRow onClick={() => setCollapsed(true)}>
        <SavesHeader>Saves</SavesHeader>
        <SavesHeader>💾</SavesHeader>
      </TitleRow>
      <SubtitleRow>
        <HeaderButton onClick={() => setSortOnName(true)}> Name </HeaderButton>
        <HeaderButton onClick={() => setSortOnName(false)}> Last Modified </HeaderButton>
      </SubtitleRow>
      <SaveList>
        {(props.saves ?? []).sort(sorter).map((save, index) => (
          <li key={index}>
            <SaveLoadButton selected={props.selected?.includes(index)} onClick={() => {
              if (!props.selected?.includes(index) && props.onSelect) {
                props.onSelect(index);
              }
            }}>
              <SaveRow>
                <span style={{paddingRight: "2em"}}>
                {save[0]}
                </span>
                <span>
                {save[1].toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
                </span>
              </SaveRow>
            </SaveLoadButton>
          </li>
        ))}
      </SaveList>
    </SaveTable>
  );
}