import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator();
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: {
    oneOf: [
      { type: 'object', properties: { ref: { type: 'string' } } },
      { type: 'object', properties: { Id: { type: 'string' } } }
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
