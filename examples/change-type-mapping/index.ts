import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator({
  typeMapping: {
    String: ({constrainedModel, options, propertyKey}) => {
      return 'integer';
    }
  }
});

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

export async function generate() : Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
generate();
