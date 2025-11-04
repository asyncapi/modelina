import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator({
  processorOptions: {
    jsonSchema: {
      allowInheritance: true
    }
  }
});

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  allOf: [
    {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        age: {
          type: 'number'
        }
      }
    }
  ],
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

