import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator({
  processorOptions: {
    jsonSchema: {
      ignoreAdditionalProperties: true
    }
  }
});

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  // Note: additionalProperties defaults to true in JSON Schema draft 7
  // This example shows how ignoreAdditionalProperties prevents
  // the generation of a catch-all property when other properties exist
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    name: {
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

