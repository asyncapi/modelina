import {
  TS_JSONBINPACK_PRESET,
  TypeScriptGenerator,
  TS_COMMON_PRESET
} from '../../src';

const generator = new TypeScriptGenerator({
  presets: [
    {
      preset: TS_COMMON_PRESET,
      options: {
        marshalling: true
      }
    },
    TS_JSONBINPACK_PRESET
  ]
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'Test',
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
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
