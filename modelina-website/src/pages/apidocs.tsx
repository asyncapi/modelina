import GenericLayout from '@/components/layouts/GenericLayout';

function iframe() {
  return {
    __html: '<iframe src="/apidocs/generated/index.html" width="100%" height="100%"></iframe>'
  };
}

export default function APIDocsPage() {
  const description = 'Get all the descriptions, directly from the code';
  const image = '/img/social/modelina-card.jpg';

  return (
    <GenericLayout
      title='API Documentation'
      description={description}
      image={image}
      wide={false}
      full
      padding=''
      footerPadding=''
    >
      <div style={{ height: 800 }} dangerouslySetInnerHTML={iframe()} />
    </GenericLayout>
  );
}