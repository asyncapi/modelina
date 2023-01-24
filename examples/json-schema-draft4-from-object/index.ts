import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator();
const jsonSchemaDraft4 = {
  $schema: 'http://json-schema.org/draft-04/schema#',
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
  const models = await generator.generate(jsonSchemaDraft4);
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
