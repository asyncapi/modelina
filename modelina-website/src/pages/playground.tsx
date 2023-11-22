import Playground from '@/components/playground/Playground';
import NewPlayground from '@/components/playground/NewPlayground';
import GenericLayout from '@/components/layouts/GenericLayout';

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
      {/* <Playground /> */}
      <NewPlayground />
    </GenericLayout>
  );
}
