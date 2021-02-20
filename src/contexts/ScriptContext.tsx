import React, { createContext, useContext, useReducer } from 'react';
import { ScriptObj } from '../types/main';
import { initialScriptState, ScriptReducer, ScriptReducerData } from '../stores/ScriptStore';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ScriptContext = createContext();

export function useScriptContext(): [cli: ScriptObj, reducer: React.Dispatch<ScriptReducerData>] {
  return useContext<any>(ScriptContext);
}

export function ScriptContextProvider(props) {
  const [cli, setCli] = useReducer(ScriptReducer, initialScriptState);

  return (
    <ScriptContext.Provider value={[cli, setCli]}>
      {props.children}
    </ScriptContext.Provider>
  );
}
