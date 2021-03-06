import styled, {css} from "styled-components";

export const VickyText = css`
  font-family: "Times New Roman", serif;
`;

export const VickyFrills = css`
  border-style: groove groove outset groove;
  border-width: medium;
  border-color: palegoldenrod;

  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.15), 0 0 5px 5px inset rgba(0, 0, 0, 0.15);
  text-align: center;
  text-decoration: none;
  display: inline-block;
  padding: 0.25em 0.5em;
  font-size: 3rem;
  ${VickyText};
  margin: 4px 2px;
  text-shadow: 0 0 1px #fff;
`;

export const TableItem = styled.td`
  vertical-align: top;
  text-align: initial;
`;