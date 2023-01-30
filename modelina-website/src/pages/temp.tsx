// `pages` directory
interface GeneratorCallbackProps {
  models: any[];
  generatorCode: string;
};
export async function getServerSideProps() {
  return { props: { models: [''] } };
}

export default function Dashboard({ generatorCode, models }: GeneratorCallbackProps) {
  return models.map((model) => <div>{model}</div>);
}
