'use client';

import { useEffect, useState } from 'react';

import { PlaygroundContextProvider } from '@/components/contexts/PlaygroundContext';
import GenericLayout from '@/components/layouts/GenericLayout';
import Playground from '@/components/playground/Playground';

export default function PlaygroundPage() {
  const [width, setWidth] = useState(typeof window === 'undefined' ? 0 : window.innerWidth);
  const description = 'Try out Modelina and see a fraction of what it can do.';
  const image = '/img/social/modelina-card.jpg';

  // To avoid hydration error
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <GenericLayout title='Playground' description={description} image={image} wide full padding='' footerPadding='mb-0'>
      {width > 768 ? (
        <PlaygroundContextProvider>
          <Playground />
        </PlaygroundContextProvider>
      ) : (
        <div className='flex h-[85vh] w-full items-center justify-center p-4 text-center'>
          Please revisit from the desktop to use the Modelina Playground.
        </div>
      )}
    </GenericLayout>
  );
}
