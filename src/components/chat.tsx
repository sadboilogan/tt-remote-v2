import { useExtraReducer } from '../stores/ExtraStore';
import { useEffect } from 'react';
import { ChatItem, CleanChatItem } from '../types/chat';
import { colorize, parseChat } from '../libs/chat';
import { useScriptReducer } from '../stores/ScriptStore';
import injectCode from '../libs/helpers';
import { Text } from '@geist-ui/react';
import { useCliContext } from '../contexts/ClientContext';

export default function Chat() {
  const [extra, setExtra] = useExtraReducer();
  const [cli] = useCliContext();
  const [scripts] = useScriptReducer();

  console.log(cli);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useEffect(async () => {
    const { Runtime } = cli.client;

    Runtime.bindingCalled(({ name, payload, executionContextId }: {name: string, payload: string, executionContextId: string}) => {
      if (name !== 'chatMessages') return;
      const chatData: ChatItem[] = JSON.parse(payload);
      const formattedChat = parseChat(chatData);
      setExtra({ type: 'set', payload: { messages: formattedChat } });
    });

    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (scripts?.['nui://chat/html/App.js']) {
          clearInterval(interval);
          resolve(true);
        }
      }, 1000);
    });

    const scr = scripts['nui://chat/html/App.js'];

    await Runtime.addBinding({
      name: 'chatMessages',
      executionContextId: scr.executionContextId
    });

    await injectCode('nui://chat/html/App.js', 81, 'this.messages.push(message);chatMessages(JSON.stringify(this.messages));');

    await Runtime.evaluate({
      expression: 'fetch(\'http://chat/chatResult\', {method: \'POST\', body: \'{"message":"/code","channel":"Chat"}\'})'
    });
  }, []);

  return (
    <div style={{ height: 500, width: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column-reverse' }}>
      {extra.messages.length === 0 && (<Text>It's pretty silent around here... check back in a bit!</Text>)}
      {extra.messages.map((msg) => {
        return (
          <div key={Math.random() * 2123}>
            <Text style={{ marginTop: 5, marginBottom: 5 }}>
              <div dangerouslySetInnerHTML={{ __html: colorize(msg.author) }} style={{ color: `rgb(${msg.colour})` }}/>
              <div dangerouslySetInnerHTML={{ __html: colorize(msg.msg) }} />
            </Text>
          </div>
        );
      })}
    </div>
  );
}
