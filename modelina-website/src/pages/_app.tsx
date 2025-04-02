import '../styles/globals.css';

import Script from 'next/script';
import { useMemo } from 'react';

import AppContext from '../components/contexts/AppContext';
import { ThemeProvider } from '../components/contexts/ThemeContext';
import Footer from '../components/layouts/Footer';

export default function App({ Component, pageProps, router }: any) {
  const contextValue = useMemo(() => ({ path: router.asPath }), [router.asPath]);

  return (
    <AppContext.Provider value={contextValue}>
      <ThemeProvider>
        <Script 
          src="https://buttons.github.io/buttons.js"
          strategy="lazyOnload"
        />
        <div className='flex min-h-screen flex-col bg-white dark:bg-dark transition-colors'>
          <Component {...pageProps} />
          <div className='mt-auto'>
            <Footer />
          </div>
        </div>
      </ThemeProvider>
    </AppContext.Provider>
  );
}