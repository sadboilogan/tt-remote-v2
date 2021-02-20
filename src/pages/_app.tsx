import { CssBaseline, GeistProvider } from '@geist-ui/react';
import { ClientContextProvider } from '../contexts/ClientContext';
import { ScriptContextProvider } from '../contexts/ScriptContext';
import { ExtraContextProvider } from '../contexts/ExtraContext';

export default function App({ Component, pageProps }) {
  return (
    <ClientContextProvider>
      <ScriptContextProvider>
        <ExtraContextProvider>
          <GeistProvider themeType="dark">
            <CssBaseline/>
            <Component {...pageProps} />
          </GeistProvider>
        </ExtraContextProvider>
      </ScriptContextProvider>
    </ClientContextProvider>
  );
}
