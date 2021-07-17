import '../styles/globals.css';
import type { AppProps } from 'next/app';

process.env.PUBLIC_URL ??= process.env.DEV ? "../public/" : "./"

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
