export interface ChatItem {
  args: string[],
  channel?: string | string[],
  color?: [r: number, g: number, b: number],
  multiline?: boolean,
  templateId?: string
}

export interface CleanChatItem {
  author?: string,
  channels?: string[],
  msg?: string,
  colour?: string
}
