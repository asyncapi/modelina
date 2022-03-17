import { CSharpGenerator, CSHARP_DEFAULT_PRESET } from '../../src';

const generator = new CSharpGenerator({
  presets: [
    {
      preset: CSHARP_DEFAULT_PRESET,
      options: {
        autoImplementedProperties: true
      }
    }]
});

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'array',
      items: {
        type: 'string',
        format: 'email'
      }
    }
  }
};

export async function generate(): Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
generate();
