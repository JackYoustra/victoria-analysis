import styled, {css} from "styled-components";
import {VickyFrills} from "../../styles/VickyFrills";
import {Link} from "react-router-dom";

export const Bar = styled.div`
  display: flex;
  flex-direction: row;
`;

const Element = css`
  ${VickyFrills};
  padding: 0 10pt 0 0;
  flex-direction: column;
  background-image: url(https://vic2.paradoxwikis.com/images/0/07/MainBG2.png);
  height: 80pt;
  //width: 200pt;
  color: white;
  
  &:active {
    filter: brightness(85%);
  }
  &:hover {
    cursor: pointer;
    background-blend-mode: color-burn;
  }
`;

export const LinkElement = styled(Link)`
  ${Element};
`;

export const ButtonElement = styled.button`
  ${Element};
  height: auto;
`;

export const TitleHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  align-items: flex-start;
`;

export const TopIcon = styled.img`
  width: 40pt;
  height: 40pt;
`;

export const TopEmoji = styled.span`
  width: 40pt;
  height: 40pt;
`;