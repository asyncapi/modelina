import Playground from '@/components/playground/Playground';
import Playground2 from '@/components/playground/Playground2';
import NewPlayground from '@/components/playground/NewPlayground';
import GenericLayout from '@/components/layouts/GenericLayout';
import { PlaygroundContextProvider } from '@/components/contexts/PlaygroundContext';

export default function PlaygroundPage() {
  const description = 'Try out Modelina and see a fraction of what it can do.';
  const image = '/img/social/modelina-card.jpg';

  return (
    <GenericLayout
      title="Playground"
      description={description}
      image={image}
      wide
      full
    >
      <PlaygroundContextProvider>
        {/* <Playground /> */}
        {/* <NewPlayground /> */}
        <Playground2 />
      </PlaygroundContextProvider>
    </GenericLayout>
  );
}
