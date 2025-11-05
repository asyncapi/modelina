import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator({
  processorOptions: {
    jsonSchema: {
      ignoreAdditionalItems: true
    }
  }
});

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    tags: {
      type: 'array',
      // Note: additionalItems defaults to true in JSON Schema draft 7
      // This example shows how ignoreAdditionalItems prevents
      // the generation of a union type with any additional types
      // when specific items are already defined
      items: {
        type: 'string'
      }
    },
    coordinates: {
      type: 'array',
      items: [{ type: 'number' }, { type: 'number' }]
      // Without ignoreAdditionalItems, this would allow any additional items beyond the first two
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
