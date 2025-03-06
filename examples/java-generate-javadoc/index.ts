import { JavaGenerator, JAVA_DESCRIPTION_PRESET } from '../../src';

const generator = new JavaGenerator({
  presets: [JAVA_DESCRIPTION_PRESET]
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'JavaDoc',
  type: 'object',
  description: 'Description for class',
  examples: [{ prop: 'value' }],
  properties: {
    prop: {
      type: 'string',
      description: 'Description for prop',
      examples: ['exampleValue']
    }
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
