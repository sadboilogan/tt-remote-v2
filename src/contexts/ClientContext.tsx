import React, { useState, createContext, useContext } from 'react';
import { ClientReducer, useCliReducer } from '../stores/ClientStore';
import { WsData } from '../types/main';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ClientContext = createContext();

export function useCliContext(): [cli: WsData, reducer: React.Dispatch<ClientReducer>] {
  return useContext<any>(ClientContext);
}

export function ClientContextProvider(props) {
  const [cli, setCli] = useCliReducer();

  return (
    <ClientContext.Provider value={[cli, setCli]}>
      {props.children}
    </ClientContext.Provider>
  );
}
