import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator({
  modelType: 'interface',
  moduleSystem: 'ESM'
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    other_model: {
      type: 'object',
      $id: 'OtherModel',
      properties: { street_name: { type: 'string' } }
    }
  }
};

export async function generate(): Promise<void> {
  const models = await generator.generateCompleteModels(jsonSchemaDraft7, {
    exportType: 'named'
  });
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
