import { TypeScriptGenerator, OutputModel } from '../../src';

const generator = new TypeScriptGenerator({ modelType: 'interface' });
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    }
  }
};

export async function generate(logCallback : (msg: string) => void) : Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    logCallback(model.result);
  }
}
generate(console.log);
