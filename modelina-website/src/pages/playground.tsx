'use client';

import { PlaygroundContextProvider } from '@/components/contexts/PlaygroundContext';
import { PlaygroundLayoutProvider } from '@/components/contexts/PlaygroundLayoutContext';
import GenericLayout from '@/components/layouts/GenericLayout';
import Playground from '@/components/playground/Playground';

export default function PlaygroundPage() {
  const description = 'Try out Modelina and see a fraction of what it can do.';
  const image = '/img/social/modelina-card.jpg';

  return (
    <GenericLayout title='Playground' description={description} image={image} wide full padding='' footerPadding='mb-0'>
      <PlaygroundContextProvider>
        <PlaygroundLayoutProvider>
          <Playground />
        </PlaygroundLayoutProvider>
      </PlaygroundContextProvider>
    </GenericLayout>
  );
}
