import Playground from '@/components/playground/Playground';
import OldPlayground from '@/components/playground/OldPlayground';
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
      padding = ""
      footerPadding = "mb-0"
    >
      <PlaygroundContextProvider>
        {/* <OldPlayground /> */}
        {/* <NewPlayground /> */}
        <Playground />
      </PlaygroundContextProvider>
    </GenericLayout>
  );
}
