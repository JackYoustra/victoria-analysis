import styled from "styled-components";
import {VickyFrills} from "../../styles/VickyFrills";
import {Link} from "react-router-dom";

const Bar = styled.div`
  display: flex;
  flex-direction: row;
`;

const Element = styled(Link)`
  ${VickyFrills};
  padding: 0;
  flex-direction: column;
  background-image: url(https://vic2.paradoxwikis.com/images/0/07/MainBG2.png);
  height: 80pt;
  width: 200pt;
  color: white;
  
  &:active {
    filter: brightness(85%);
  }
  &:hover {
    cursor: pointer;
    background-blend-mode: color-burn;
  }
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

export default function RouteBar() {
  return (
    <Bar>
      <Element to="/factories">
        <TitleHeader>
          <TopIcon
            src="https://vic2.paradoxwikis.com/images/3/37/Budget_nat_stockpile.png"
            alt="Save Icon"
          />
          Factories
        </TitleHeader>
      </Element>
      <Element to="/pops">
        <TitleHeader>
          <TopIcon
            src="https://vic2.paradoxwikis.com/images/3/37/Budget_nat_stockpile.png"
            alt="Save Icon"
          />
          Pops
        </TitleHeader>
      </Element>
      <Element to="/wars">
        <TitleHeader>
          <TopIcon
            src = "https://vic2.paradoxwikis.com/images/f/fd/Tech_army.png"
            alt = "War Icon"
          />
          War
        </TitleHeader>
      </Element>
    </Bar>
  );
}