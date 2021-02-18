import { ScriptObj } from '../types/main';
import { Dispatch, useReducer } from 'react';

const initialState: ScriptObj = {};

interface ScriptReducer {
  type: string,
  payload?: ScriptObj,
}

function ScriptReducer(state, action?: ScriptReducer) {
  switch (action.type) {
  case 'set':
    return { ...state, ...action.payload };
  case 'reset':
    return { initialState };
  default:
    throw new Error();
  }
}

export function useScriptReducer(): [extra: ScriptObj, reducer: Dispatch<ScriptReducer>] {
  return useReducer(ScriptReducer, initialState);
}
