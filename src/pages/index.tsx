import { ReactElement } from 'react';
import { Button, Col, Input, Page, Row, Tabs, Text, useToasts } from '@geist-ui/react';
import { WsJsonData } from '../types/main';
import CDP from 'chrome-remote-interface';
import devtools from 'devtools-protocol';
import Chat from '../components/chat';
import { useCliContext } from '../contexts/ClientContext';
import { useScriptContext } from '../contexts/ScriptContext';

export default function Home(): ReactElement {
  const [, setToast] = useToasts();
  const [cli, setCli] = useCliContext();
  const [curScripts, setScripts] = useScriptContext();

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.criRequest = (options, callback) => {
      console.log(options, callback);
      const { host, port, path } = options;
      const url = `http://${host}:${port}${path}`;
      fetch(url).then((res) => res.text()).then((res) => callback(null, res)).catch((err) => callback(err));
    };
  }

  const updateJSON = (e) => {
    const jsonData = e.target.value;
    setCli({ type: 'set', payload: { connJSON: jsonData } });
  };

  const connect = async () => {
    if (!cli.connJSON) {
      setToast({ text: 'No connection data passed!', type: 'error' });
      return;
    }

    let connData: WsJsonData;
    try {
      const data: WsJsonData[] = JSON.parse(cli.connJSON);
      for (const wsConn of data) {
        if (wsConn.title === 'CitizenFX root UI' && wsConn.webSocketDebuggerUrl.includes('ws://localhost:13172') && wsConn.url === 'nui://game/ui/root.html') {
          connData = wsConn;
        }
      }
    } catch(err) {
      setToast({ text: 'Invalid JSON data. Error: ' + err, type: 'error' });
      return;
    }

    setCli({ type: 'set', payload: { connecting: true } });

    try {
      const cefCli = await CDP({
        target: connData?.webSocketDebuggerUrl,
        local: true
      });

      const { Page, Debugger, Runtime } = cefCli;

      Debugger.scriptParsed((script: devtools.Debugger.ScriptParsedEvent) => {
        if (!script.url.includes('nui://') || script.url.includes('nui://patches/')) return;
        const scripts = curScripts;
        scripts[script.url] = script;
        setScripts({ type: 'set', payload: scripts });
        console.log(`Found script @ ${script.url}`);
      });

      await Runtime.enable();
      await Debugger.enable();
      await Page.enable();

      setCli({ type: 'set', payload: { connected: true, connecting: false, client: cefCli } });
      return;
    } catch (err) {
      setCli({ type: 'set', payload: { connecting: false } });
      setToast({ text: 'Failed to connect. Error: ' + err, type: 'error' });
      return;
    }
  };

  const disconnect = async () => {
    if (cli.client && cli.connected && !cli.connecting) {
      const { Runtime } = cli.client;

      await Runtime.removeBinding('chatMessages');
      await cli.client?.close();

      setScripts({ type: 'reset' });
      setCli({ type: 'reset' });
      setToast({
        type: 'success',
        text: 'Disconnected from server'
      });
    }
  };

  return (
    <div>
      <Page>
        <Page.Header center>
        </Page.Header>
        <Page.Content>
          <Row justify="center" >
            <Col>
              <Row justify="center">
                <h3 style={{ marginBottom: 0 }}>How to use?</h3>
              </Row>
              <Row justify="center">
                <p style={{ marginTop: 0 }}>Simply visit <a href="http://localhost:13172/json">http://localhost:13172/json</a> and select all, then paste in the box below. (or ctrl-a this box)</p>
              </Row>
              <Row justify="center">
                <iframe style={{ width: '30%', height: 50, marginBottom: 10, background: 'white' }} src="http://localhost:13172/json"/>
              </Row>

              <Row justify="center">
                <Input onChange={updateJSON} size="large" placeholder="JSON data"/>
                <Button onClick={!cli.connected ? connect : disconnect} loading={cli.connecting}>{cli.connected ? 'Disconnect' : 'Connect'}</Button>
              </Row>

              {(cli.connected && cli.client) && (
                <Row justify="center" style={{ marginTop: 20 }}>
                  <Tabs style={{ width: '120%' }} initialValue="chat">
                    <Tabs.Item label="Chat" value="chat">
                      <Chat/>
                    </Tabs.Item>
                    <Tabs.Item label="Theme" value="theme">
                      <p>Todo</p>
                    </Tabs.Item>
                  </Tabs>
                </Row>
              )}
            </Col>
          </Row>
        </Page.Content>
        <Page.Footer>
          <Row justify="center">
            <h4>Made with 💖 by logan</h4>
          </Row>
        </Page.Footer>
      </Page>
    </div>
  );
}
