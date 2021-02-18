import { WsData } from '../types/main';
import { Dispatch, useReducer } from 'react';
import { CleanChatItem } from '../types/chat';

const initialState = {
  messages: []
};

interface ExtraData {
  messages?: CleanChatItem[]
}

interface ExtraReducer {
  type: string,
  payload?: ExtraData
}

function ExtraReducer(state, action: ExtraReducer) {
  switch (action.type) {
  case 'set':
    return { ...state, ...action.payload };
  case 'reset':
    return { initialState };
  default:
    throw new Error();
  }
}

export function useExtraReducer(): [extra: ExtraData, reducer: Dispatch<ExtraReducer>] {
  return useReducer(ExtraReducer, initialState);
}
