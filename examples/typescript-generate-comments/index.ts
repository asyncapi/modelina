import { TS_DESCRIPTION_PRESET, TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator({
  modelType: 'interface',
  presets: [TS_DESCRIPTION_PRESET]
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'Test',
  type: 'object',
  additionalProperties: true,
  required: ['string prop'],
  description: 'Main Description',
  properties: {
    'string prop': { type: 'string' },
    numberProp: {
      type: 'number',
      description: 'Description',
      examples: 'Example'
    },
    objectProp: {
      type: 'object',
      $id: 'NestedTest',
      properties: { stringProp: { type: 'string' } },
      examples: ['Example 1', 'Example 2']
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
