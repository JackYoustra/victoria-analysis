import React, {MouseEventHandler} from 'react';
import styled from 'styled-components';
import './App.css';
import { Routes, Route} from "react-router-dom";
import Home from "./routes/Home";
import SaveViewer from "./routes/SaveViewer";
import VickySavesProvider from "./logic/VickySavesProvider";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <VickySavesProvider>
          <Routes>
            <Route path="/" element={ <Home /> }/>
            <Route path="/about" element={ <SaveViewer/> }/>
          </Routes>
        </VickySavesProvider>
      </header>
    </div>
  );
}

export default App;
