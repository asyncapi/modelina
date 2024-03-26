import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator({
  processorOptions: {
    jsonSchema: {
      propertyNameForAdditionalProperties: 'extensions'
    }
  }
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: true,
  properties: {
    email: {
      type: 'string'
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
