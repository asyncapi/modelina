import '../styles/globals.css';

import Head from 'next/head';
import { useMemo } from 'react';

import AppContext from '../components/contexts/AppContext';
import Footer from '../components/layouts/Footer';

export default function App({ Component, pageProps, router }: any) {
  const contextValue = useMemo(() => ({ path: router.asPath }), [router.asPath]);

  return (
    <AppContext.Provider value={contextValue}>
      <Head>
        <script async defer src='https://buttons.github.io/buttons.js'></script>
      </Head>
      <div className='flex min-h-screen flex-col'>
        <Component {...pageProps} />
        <div className='mt-auto'>
          <Footer />
        </div>
      </div>
    </AppContext.Provider>
  );
}
