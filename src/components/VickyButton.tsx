import styled from "styled-components";
import {VickyFrills} from "../styles/VickyFrills";

export const VickyButton = styled.button`
  ${VickyFrills};
  
  background-image: radial-gradient(100% 75% at 50% 100%,
  #819aa2 0%,
  #728496 100%);

  border-radius: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    cursor: pointer;
    background-image: radial-gradient(100% 75% at 50% 100%,
    #728496 0%,
    #819aa2 100%);
  }

  &:active {
    filter: brightness(85%);
  }
`;

export const VickyMinorButton = styled(VickyButton)`
  font-size: 70%;
`;
