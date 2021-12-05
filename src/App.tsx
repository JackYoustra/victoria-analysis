import React, {MouseEventHandler} from 'react';
import './App.css';
import Home from "./routes/Home";
import VickySavesProvider from "./logic/VickySavesProvider";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <VickySavesProvider>
            <Home />
        </VickySavesProvider>
      </header>
    </div>
  );
}

export default App;
