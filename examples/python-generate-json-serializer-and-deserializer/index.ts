import { PythonFileGenerator, PYTHON_JSON_SERIALIZER_PRESET } from '../../src';

const generator = new PythonFileGenerator({
  presets: [PYTHON_JSON_SERIALIZER_PRESET]
});

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: true,
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
