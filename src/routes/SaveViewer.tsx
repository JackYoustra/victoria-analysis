import styled, {StyledFunction} from "styled-components";
import {VickyFrills, VickyText} from "../styles/VickyFrills";

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

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: start;
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
`;

interface SaveLoadButtonProps {
  selected?: boolean;
}

const SaveLoadButton = styled.button<SaveLoadButtonProps>`
  ${VickyText};
  background-color: ${props => props.selected ? "rgba(0, 0, 0, 0.25)" : "transparent"};
  border-width: 0;

  padding-left: 10pt;
  padding-right: 10pt;

  display: block;
  width: 100%;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
    filter: ${props => props.selected ? "none" : "invert(100%)"};
  }
`;

export default function SaveViewer(props: SaveViewerProps) {
  return (
    <SaveTable>
      <TitleRow>Saves</TitleRow>
      {(props.saves ?? []).map((save, index) => (
        <div key={index}>
          <SaveLoadButton selected={props.selected?.includes(index)} onClick={() => props.onSelect && props.onSelect(index)}>
            <SaveRow>
              <span>
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
        </div>
      ))}
    </SaveTable>
  );
}