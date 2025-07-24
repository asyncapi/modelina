import {
  PythonGenerator,
  PYTHON_PYDANTIC_PRESET,
  PYTHON_PYDANTIC_TYPE_MAPPING
} from '../../src';

const generator = new PythonGenerator({
  presets: [PYTHON_PYDANTIC_PRESET],
  typeMapping: PYTHON_PYDANTIC_TYPE_MAPPING
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  required: ['requiredField'],
  properties: {
    optionalField: {
      type: 'string',
      format: 'email',
      description: 'this field is optional'
    },
    requiredField: {
      type: 'string',
      format: 'email',
      description: 'this field is required'
    },
    noDescription: {
      type: 'string'
    },
    options: {
      $id: 'options',
      type: ['integer', 'boolean', 'string'],
      enum: [123, 213, true, 'Run']
    },
    'content-type': { type: 'string' }
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
