import { WsData } from '../types/main';
import { Dispatch, useReducer } from 'react';

export const initialClientState: WsData = {
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

export function CliReducer(state, action: ClientReducer) {
  switch (action.type) {
  case 'set':
    return { ...state, ...action.payload };
  case 'reset':
    return { initialClientState };
  default:
    throw new Error();
  }
}
