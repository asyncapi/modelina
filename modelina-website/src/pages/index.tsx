import { GetServerSideProps } from 'next'

// `pages` directory
interface GeneratorCallbackProps {
  models: any[];
  generatorCode: string;
};


export default function Dashboard({ generatorCode, models }: GeneratorCallbackProps) {
  return models.map((model) => <div>{model}</div>);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(context.query);
  return { props: { models: [''] } as GeneratorCallbackProps };
}