import React, {MouseEventHandler} from 'react';
import logo from './logo.svg';
import styled from 'styled-components';
import './App.css';

const VickyButton = styled.button`
  border-style: groove groove outset groove;
  border-width: medium;
  border-color: palegoldenrod;
  border-radius: 200px;

  background-image: radial-gradient(100% 75% at 50% 100%,
  #819aa2 0%,
  #728496 100%);
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.15), 0 0 5px 5px inset rgba(0, 0, 0, 0.15);
  text-align: center;
  text-decoration: none;
  display: inline-block;
  padding: 0.25em 0.5em;
  font-size: 3rem;
  font-family: "Times New Roman", serif;
  margin: 4px 2px;

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

function App() {
  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
  const handleClick: MouseEventHandler<HTMLButtonElement> = event => {
    hiddenFileInput?.current?.click();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={"https://vic2.paradoxwikis.com/images/0/0e/V2_wiki_logo.png"} className="App-logo" alt="logo" />
        <VickyButton onClick={handleClick}> Choose Victoria Folder </VickyButton>
          <input
              type="file"
              // @ts-ignore
              webkitdirectory=""
              // @ts-ignore
              directory=""
              multiple
              ref={hiddenFileInput}
              style={{display: "none"}}
          />
      </header>
    </div>
  );
}

export default App;
