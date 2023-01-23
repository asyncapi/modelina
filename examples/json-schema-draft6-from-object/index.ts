import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator();
const jsonSchemaDraft6 = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    }
  }
};

export async function generate(): Promise<void> {
  const models = await generator.generate(jsonSchemaDraft6);
  for (const model of models) {
    console.log(model.result);
  }
}
generate();
