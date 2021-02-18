import { CssBaseline, GeistProvider } from '@geist-ui/react';
import { ClientContextProvider } from '../contexts/ClientContext';

export default function App({ Component, pageProps }) {
  return (
    <ClientContextProvider>
      <GeistProvider themeType="dark">
        <CssBaseline/>
        <Component {...pageProps} />
      </GeistProvider>
    </ClientContextProvider>
  );
}
