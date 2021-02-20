import { ScriptObj } from '../types/main';
import { Dispatch, useReducer } from 'react';

export const initialScriptState: ScriptObj = {};

export interface ScriptReducerData {
  type: string,
  payload?: ScriptObj,
}

export function ScriptReducer(state, action?: ScriptReducerData) {
  switch (action.type) {
  case 'set':
    return { ...state, ...action.payload };
  case 'reset':
    return { initialScriptState };
  default:
    throw new Error();
  }
}
