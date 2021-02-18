import devtools from 'devtools-protocol';

export interface WsJsonData {
  description: string,
  devtoolsFrontendUrl: string,
  id: string,
  title: string,
  type: string,
  url: string,
  webSocketDebuggerUrl: string,
}

export interface WsData {
  connected?: boolean,
  connecting?: boolean,
  valid?: boolean,
  client?: null | any,
  connJSON?: string,
  connObject?: WsJsonData | null,
}

export interface ScriptObj {
  [key: string]: devtools.Debugger.ScriptParsedEvent
}

export interface FormattedMsg {
  channels: string,
  msg: string,
  colour: string,
  author: string
}
