import { GoGenerator } from '../../src';

const generator = new GoGenerator();
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: {
    oneOf: [
      { type: 'object', properties: { ref: { type: 'string' } } },
      { type: 'object', properties: { Id: { type: 'string' } } },
      { type: 'string' },
      { type: 'number' },
      { type: 'array', items: { type: 'string' } },
      { type: 'array', items: [{ type: 'string' }, { type: 'number' }] },
      { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }] }
    ]
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
