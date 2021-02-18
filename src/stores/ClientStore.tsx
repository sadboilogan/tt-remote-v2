import { WsData } from '../types/main';
import { Dispatch, useReducer } from 'react';

const initialState: WsData = {
  connected:  false,
  connecting: false,
  valid:      false,
  client:     null,
  connJSON:   '',
  connObject: null,
};

export interface ClientReducer {
  type: string,
  payload?: WsData,
}

function CliReducer(state, action: ClientReducer) {
  switch (action.type) {
  case 'set':
    return { ...state, ...action.payload };
  case 'reset':
    return { initialState };
  default:
    throw new Error();
  }
}

export function useCliReducer(): [cli: WsData, reducer: Dispatch<ClientReducer>] {
  return useReducer(CliReducer, initialState);
}
