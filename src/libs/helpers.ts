import { ScriptObj, WsData } from '../types/main';

export default async function injectCode(cli: WsData, scripts: ScriptObj, script: string, line: number, code: string) {
  if (!scripts?.[script]) return;

  const scr = scripts[script];
  const { Debugger } = cli.client;

  const scriptCode = await Debugger.getScriptSource({ scriptId: scr.scriptId });
  let ln = 1;
  let newScript = '';
  scriptCode.scriptSource.split('\r\n').forEach((lno: string) => {
    if (ln === line) {
      newScript += code;
    } else {
      newScript += lno;
    }
    newScript += '\r\n';
    ln++;
  });

  return await Debugger.setScriptSource({ scriptId: scr.scriptId, scriptSource: newScript });
}
