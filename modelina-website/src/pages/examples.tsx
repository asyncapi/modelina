import Examples from '@/components/examples/Examples';
import GenericLayout from '@/components/layouts/GenericLayout';

export default function Index() {
  const description =
    'Sometimes you just want to generate data models for your payload. Modelina is a library for generating data models based on inputs such as AsyncAPI, OpenAPI, or JSON Schema documents.';
  const image = '/img/social/modelina-card.jpg';

  return (
    <GenericLayout title='Modelina' description={description} image={image} full={true}>
      <Examples />
    </GenericLayout>
  );
}
