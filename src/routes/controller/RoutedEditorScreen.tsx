import {Route, Routes} from "react-router-dom";
import React from "react";
import DataExporter from "../Data/DataExporter";
import WarsView from "../War/Wars";


export default function RoutedEditorScreen() {
  return (
    <Routes>
      <Route path="/factories" element={ <DataExporter field={"factories"}/> }/>
      <Route path="/pops" element={ <DataExporter field={"pops"}/> }/>
      <Route path="/wars" element={ <WarsView /> }/>
    </Routes>
  )
}