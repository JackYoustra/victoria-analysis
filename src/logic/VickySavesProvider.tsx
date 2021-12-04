import React from "react";
import {VickySave} from "./processing/vickySave";
import _ from "lodash";
import VickyContext from "./processing/vickyContext";
import {VickyGameConfiguration} from "./processing/vickyConfiguration";

type Action = {type: 'setSave', value: VickySave} | {type: 'mergeConfiguration', value: VickyGameConfiguration}
type Dispatch = (action: Action) => void
type State = VickyContext
type VickySavesProviderProps = {children: React.ReactNode}

const VickySavesContext = React.createContext<
  {state: State; dispatch: Dispatch} | undefined
  >(undefined);

function saveReducer(state: State, action: Action): VickyContext {
  switch (action.type) {
    case 'setSave': {
      return {
        ...state,
        save: action.value,
      }
    }
    case 'mergeConfiguration': {
      return {
        ...state,
        // @ts-ignore
        configuration: _.merge({... state.configuration}, _.pickBy(action.value, v => !_.isUndefined(v))),
      }
    }
  }
}

export default function VickySavesProvider({children}: VickySavesProviderProps) {
  const [state, dispatch] = React.useReducer(saveReducer, {});
  const value = {state, dispatch};
  return <VickySavesContext.Provider value={value}>
    {children}
  </VickySavesContext.Provider>
}

export function useSave() {
  const context = React.useContext(VickySavesContext)
  // if (context === undefined) {
  //   throw new Error('useSave must be used within a SaveProvider')
  // }
  return context!
}