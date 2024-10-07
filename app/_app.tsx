import '@/app/globals.css'; // Import global styles here
import type { AppProps } from 'next/app'; // Import the AppProps type

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
