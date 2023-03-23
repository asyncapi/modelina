import Head from 'next/head';
import AppContext from '../components/contexts/AppContext';
import Footer from '../components/layouts/Footer';

import '../styles/globals.css';

export default function App({ Component, pageProps, router }: any) {
  return (
    <AppContext.Provider value={{ path: router.asPath }}>
      <Head>
        <script async defer src="https://buttons.github.io/buttons.js"></script>
      </Head>
      <div className="flex flex-col min-h-screen">
        <Component {...pageProps} />
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </AppContext.Provider>
  );
}
