import React, { createContext, useContext, useReducer } from 'react';
import { ExtraData, ExtraReducer, ExtraReducerData, initialExtraState } from '../stores/ExtraStore';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ExtraContext = createContext();

export function useExtraContext(): [cli: ExtraData, reducer: React.Dispatch<ExtraReducerData>] {
  return useContext<any>(ExtraContext);
}

export function ExtraContextProvider(props) {
  const [cli, setCli] = useReducer(ExtraReducer, initialExtraState);

  return (
    <ExtraContext.Provider value={[cli, setCli]}>
      {props.children}
    </ExtraContext.Provider>
  );
}
