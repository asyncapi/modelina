"use client"
import { useEffect, useState } from 'react';
import Playground from '@/components/playground/Playground';
import GenericLayout from '@/components/layouts/GenericLayout';
import { PlaygroundContextProvider } from '@/components/contexts/PlaygroundContext';

export default function PlaygroundPage() {
  const [width, setWidth] = useState(window.innerWidth);
  const description = 'Try out Modelina and see a fraction of what it can do.';
  const image = '/img/social/modelina-card.jpg';

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <GenericLayout
      title="Playground"
      description={description}
      image={image}
      wide
      full
      padding = ""
      footerPadding = "mb-0"
    >
      {
        width > 768 ? 
          <PlaygroundContextProvider>
            <Playground />
          </PlaygroundContextProvider>
        :
          <div className='h-screen w-full p-4 flex justify-center items-center '>
            Please revisit from the desktop to use the Modelina Playground.
          </div>
      }
    </GenericLayout>
  );
}
