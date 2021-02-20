import { useEffect, useState } from 'react';
import { ChatItem, CleanChatItem } from '../types/chat';
import { colorize, parseChat } from '../libs/chat';
import injectCode from '../libs/helpers';
import { Checkbox, Divider, Text } from '@geist-ui/react';
import { useCliContext } from '../contexts/ClientContext';
import { useScriptContext } from '../contexts/ScriptContext';
import { useExtraContext } from '../contexts/ExtraContext';

export default function Chat() {
  const [extra, setExtra] = useExtraContext();
  const [cli] = useCliContext();
  const [scripts] = useScriptContext();
  const [filters, setFilters] = useState(['system', 'misc', 'chat', 'company', 'faction']);
  const [filteredMsg, setFilteredMsg] = useState([]);

  const updateFilters = (e?: any) => {
    if (e) setFilters(e);
    const msg = extra.messages.filter((msg) => (
      msg.channels.some((f) => (e || filters).includes(f))
    ));
    setFilteredMsg(msg);
  };

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

    await injectCode(cli, scripts,'nui://chat/html/App.js', 81, 'this.messages.push(message);chatMessages(JSON.stringify(this.messages));');

    setTimeout(() => {
      Runtime.evaluate({
        expression: 'fetch(\'http://chat/chatResult\', {method: \'POST\', body: \'{"message":"/code","channel":"Chat"}\'})'
      });
    }, 2500);

    updateFilters();

  }, []);

  return (
    <div>
      {extra.messages.length > 0 && (
        <div>
          <Checkbox.Group onChange={updateFilters} value={['system', 'misc', 'chat', 'company', 'faction']} style={{ marginTop: 10 }}>
            <Checkbox value="system">System</Checkbox>
            <Checkbox value="misc">Misc</Checkbox>
            <Checkbox value="chat">General</Checkbox>
            <Checkbox value="company">Company</Checkbox>
            <Checkbox value="faction">Faction</Checkbox>
          </Checkbox.Group>
          <Divider/>
        </div>
      )}
      <div style={{ height: 500, width: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column-reverse' }}>
        {extra.messages.length === 0 && (<Text>It's pretty silent around here... check back in a bit!</Text>)}
        {filteredMsg.map((msg) => {
          return (
            <div key={Math.random() * 2123}>
              <Text style={{ marginTop: 5, marginBottom: 5 }}>
                <span dangerouslySetInnerHTML={{ __html: colorize(msg.author + ' ') }} style={{ color: `rgb(${msg.colour})` }}/>
                <span dangerouslySetInnerHTML={{ __html: colorize(msg.msg) }} />
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}
