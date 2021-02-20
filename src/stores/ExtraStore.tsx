import { WsData } from '../types/main';
import { Dispatch, useReducer } from 'react';
import { CleanChatItem } from '../types/chat';

export const initialExtraState = {
  messages: []
};

export interface ExtraData {
  messages?: CleanChatItem[]
}

export interface ExtraReducerData {
  type: string,
  payload?: ExtraData
}

export function ExtraReducer(state, action: ExtraReducerData) {
  switch (action.type) {
  case 'set':
    return { ...state, ...action.payload };
  case 'reset':
    return { initialExtraState };
  default:
    throw new Error();
  }
}
