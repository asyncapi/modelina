"use client";
import { useEffect, useState } from 'react';
import Playground from '@/components/playground/Playground';
import GenericLayout from '@/components/layouts/GenericLayout';
import { PlaygroundContextProvider } from '@/components/contexts/PlaygroundContext';

export default function PlaygroundPage() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const description = 'Try out Modelina and see a fraction of what it can do.';
  const image = '/img/social/modelina-card.jpg';

  // To avoid hydration error
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <GenericLayout
      title="Playground"
      description={description}
      image={image}
      wide
      full
      padding=""
      footerPadding="mb-0"
    >
      {
        width > 768 ?
          <PlaygroundContextProvider>
            <Playground />
          </PlaygroundContextProvider>
          :
          <div className='h-[85vh] w-full p-4 flex justify-center items-center text-center'>
            Please revisit from the desktop to use the Modelina Playground.
          </div>
      }
    </GenericLayout>
  );
}
