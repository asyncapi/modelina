import { PythonGenerator, PYTHON_PYDANTIC_PRESET } from '../../src';

const generator = new PythonGenerator({
  presets: [PYTHON_PYDANTIC_PRESET]
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    optionalField: {
      type: 'string',
      format: 'email',
      optional: true,
      description: 'this field is optional'
    },
    // requiredField: {
    //   type: 'string',
    //   format: 'email',
    //   required: true,
    //   description: 'this field is required'
    // },
    noDescription: {
      type: 'string'
    },
  }
};

export async function generate() : Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
generate();
