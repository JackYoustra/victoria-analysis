import React, {MouseEventHandler} from 'react';
import './App.css';
import Home from "./routes/Home";
import VickySavesProvider from "./logic/VickySavesProvider";

function App() {
  return (
    <div className="App">
      <VickySavesProvider>
          <Home />
      </VickySavesProvider>
    </div>
  );
}

export default App;
