import { GoGenerator } from '../../src';

const generator = new GoGenerator();
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    cities: {
      $id: 'cities',
      type: 'string',
      enum: ['London', 'Rome', 'Brussels']
    },
    options: {
      $id: 'options',
      type: ['integer', 'boolean', 'string'],
      enum: [123, 213, true, 'Run']
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
