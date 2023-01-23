import { JavaGenerator, JAVA_JACKSON_PRESET } from '../../src';

const generator = new JavaGenerator({
  presets: [JAVA_JACKSON_PRESET]
});

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    min_number_prop: { type: 'number' },
    max_number_prop: { type: 'number' }
  }
};

export async function generate(): Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
