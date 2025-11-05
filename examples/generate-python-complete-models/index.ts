import { PythonGenerator } from '../../src';

export const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    objProperty: {
      type: 'object',
      properties: {
        number: {
          type: 'number'
        }
      }
    }
  }
};

export async function generate(): Promise<void> {
  const generator = new PythonGenerator();

  const models = await generator.generateCompleteModels(jsonSchemaDraft7, {
    packageName: 'modelina'
  });

  for (const model of models) {
    console.log(model.result);
  }
}

if (require.main === module) {
  generate();
}
