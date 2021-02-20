import DOMPurify from 'dompurify';
import { ChatItem, CleanChatItem } from '../types/chat';

const colourHex: {
  [colId: string]: string
} = {
  'color-0': '#ffffff',
  'color-1': '#ff4444',
  'color-2': '#99cc00',
  'color-3': '#ffbb33',
  'color-4': '#0099cc',
  'color-5': '#33b5e5',
  'color-6': '#aa66cc',
  'color-8': '#cc0000',
  'color-9': '#cc0068',
};

export function colorize(str: string): string {
  str = DOMPurify.sanitize(str, { USE_PROFILES: { html: true } });
  let s = '<span>' + (str.replace(/\^([0-9])/g, (str, color) => `</span><span style="color: ${colourHex[`color-${color}`]}">`)) + '</span>';

  const styleDict = {
    '*': 'font-weight: bold;',
    '_': 'text-decoration: underline;',
    '~': 'text-decoration: line-through;',
    '=': 'text-decoration: underline line-through;',
    'r': 'text-decoration: none;font-weight: normal;',
  };

  const styleRegex = /\^(_|\*|=|~|\/|r)(.*?)(?=$|\^r|<\/em>)/;
  while (s.match(styleRegex)) {
    s = s.replace(styleRegex, (str, style, inner) => `<em style="${styleDict[style]}">${inner}</em>`);
  }
  s = s.replace(/<span[^>]*><\/span[^>]*>/g, '');
  const directImageRegex = /\\!(\S*?)!\\/g;
  const staticEmojiRegex = /\\s([0-9]*?)s\\/g;
  const animatedEmojiRegex = /\\a([0-9]*?)a\\/g;
  s = s.replace(directImageRegex, '<img   style="width: 2%; height: 2%;" class="iconChat" src="$1"/>');
  s = s.replace(staticEmojiRegex, '<img   style="width: 2%; height: 2%;" class="iconChat" src="https://cdn.discordapp.com/emojis/$1.png?v=1"/>');
  s = s.replace(animatedEmojiRegex, '<img style="width: 2%; height: 2%;" class="iconChat" src="https://cdn.discordapp.com/emojis/$1.gif?v=1"/>');
  return s;
}

export function parseChat(chat: ChatItem[]): CleanChatItem[] {
  const cleanMessages: CleanChatItem[] = [];
  chat.slice(1).slice(-200).reverse().forEach((msg) => {
    const newMsg: CleanChatItem = {
      colour: msg?.color?.join(',') || '255,255,255',
    };

    console.log(msg);

    if (!msg?.channel) {
      newMsg.channels = ['misc'];
    } else if (typeof msg?.channel=== 'string') {
      newMsg.channels = [msg?.channel];
    } else {
      newMsg.channels = msg?.channel;
    }

    console.log(newMsg?.channels?.[0]);

    if (newMsg?.channels?.[0] === 'chat') {
      const userText = {
        id: msg.args[0],
        text: msg.args[1],
        titles: msg.args[2],
        name: msg.args[3],
      };
      newMsg.author = `[CHAT] ${userText.id}${userText.titles}${userText.name}:`;
      newMsg.msg = `${userText.text}`;
    } else if (newMsg?.channels?.[0] === 'globalchat') {
      const userText = {
        text: msg.args[1],
        name: msg.args[0],
      };
      newMsg.author = `[GLOBAL CHAT] ${newMsg?.channels?.[1] ? ` [${newMsg?.channels?.[1].toUpperCase()}]` : ''} ${userText.name}:`;
      newMsg.msg = `${userText.text}`;
    } else if (newMsg?.channels?.[0] === 'system') {
      if (newMsg?.channels?.[1] === 'radio') {
        newMsg.author = `[SYSTEM] [RADIO] ${msg.args[0]}:`;
        newMsg.msg = `${msg.args[1]}`;
      } else {
        newMsg.author = `[SYSTEM] ${newMsg?.channels?.[1] ? ` [${newMsg?.channels?.[1].toUpperCase()}]` : ''}`;
        newMsg.msg = `${msg.args[0]}`;
      }
    } else if (newMsg?.channels?.[0] === 'company') {
      newMsg.author = `[COMPANY] ${msg.args[0]}:`;
      newMsg.msg = `${msg.args[1]}`;
    }else if (newMsg?.channels?.[0] === 'misc') {
      newMsg.author = '[MISC]';
      newMsg.msg = `${msg.args[0]}`;
    } else if (newMsg?.channels?.[0] === 'faction') {
      newMsg.author = `[FACTION] ${msg.args[0]}:`;
      newMsg.msg = `${msg.args[1]}`;
    }

    cleanMessages.push(newMsg);
  });

  return cleanMessages;
}
