import { TypeScriptGenerator, OutputModel } from '../../src';

const JSONSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email'
    }
  }
};

export async function generate() : Promise<OutputModel[]> {
  const generator = new TypeScriptGenerator({ modelType: 'interface' });
  return await generator.generate(JSONSchema);
}
