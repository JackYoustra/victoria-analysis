import styled, {css} from "styled-components";
import {VickyFrills} from "../../styles/VickyFrills";
import {Link} from "react-router-dom";

const Bar = styled.div`
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

const LinkElement = styled(Link)`
  ${Element};
`;

const ButtonElement = styled.button`
  ${Element};
`;

const TitleHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  align-items: flex-start;
`;

const TopIcon = styled.img`
  width: 40pt;
  height: 40pt;
`;

const TopEmoji = styled.p`
  width: 40pt;
  height: 40pt;
`;

export default function RouteBar() {
  return (
    <Bar>
      <LinkElement to="/factories">
        <TitleHeader>
          <TopIcon
            src="https://vic2.paradoxwikis.com/images/4/4d/Tech_industrial.png"
            alt="Factory Icon"
          />
          Factories
        </TitleHeader>
      </LinkElement>
      <LinkElement to="/pops">
        <TitleHeader>
          <TopIcon
            src="https://vic2.paradoxwikis.com/images/9/98/Province_pop.png"
            alt="POP Icon"
          />
          Pops
        </TitleHeader>
      </LinkElement>
      <LinkElement to="/wars">
        <TitleHeader>
          <TopIcon
            src = "https://vic2.paradoxwikis.com/images/f/fd/Tech_army.png"
            alt = "War Icon"
          />
          War
        </TitleHeader>
      </LinkElement>
      <ButtonElement>
        <TitleHeader>
          <TopEmoji>
            📜
          </TopEmoji>
          Download JSON
        </TitleHeader>
      </ButtonElement>
    </Bar>
  );
}