import { useCliReducer } from '../stores/ClientStore';
import { useScriptReducer } from '../stores/ScriptStore';

export default async function injectCode(script: string, line: number, code: string) {
  const [scripts] = useScriptReducer();
  if (!scripts?.[script]) return;

  const [cli] = useCliReducer();

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
