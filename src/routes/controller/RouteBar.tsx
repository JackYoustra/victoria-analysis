import { LinkElement, TitleHeader, TopIcon } from "../Top Bar/BarStyles";

export default function RouteBar() {
  return (
    <>
      <LinkElement to="/victoria-analysis/factories">
        <TitleHeader>
          <TopIcon
            src="https://vic2.paradoxwikis.com/images/4/4d/Tech_industrial.png"
            alt="Factory Icon"
          />
          Factories
        </TitleHeader>
      </LinkElement>
      <LinkElement to="/victoria-analysis/pops">
        <TitleHeader>
          <TopIcon
            src="https://vic2.paradoxwikis.com/images/9/98/Province_pop.png"
            alt="POP Icon"
          />
          Pops
        </TitleHeader>
      </LinkElement>
      <LinkElement to="/victoria-analysis/wars">
        <TitleHeader>
          <TopIcon
            src = "https://vic2.paradoxwikis.com/images/f/fd/Tech_army.png"
            alt = "War Icon"
          />
          War
        </TitleHeader>
      </LinkElement>
    </>
  );
}