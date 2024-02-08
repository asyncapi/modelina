import { TypeScriptGenerator } from '../../src';

const generatorIndexedObject = new TypeScriptGenerator({
  mapType: 'indexedObject'
});
const generatorMap = new TypeScriptGenerator({ mapType: 'map' });
const generatorRecord = new TypeScriptGenerator({ mapType: 'record' });

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    person: {
      type: 'object',
      personName: { type: 'string' },
      email: {
        type: 'string',
        format: 'email'
      },
      isStudent: { type: 'boolean' },
      age: { type: 'number' }
    }
  }
};

export async function generate(): Promise<void> {
  console.log('// Generator output as indexedObject');
  const modelsIndexedObject =
    await generatorIndexedObject.generate(jsonSchemaDraft7);
  for (const model of modelsIndexedObject) {
    console.log(model.result);
  }

  console.log('// Generator output as Map');
  const modelsMap = await generatorMap.generate(jsonSchemaDraft7);
  for (const model of modelsMap) {
    console.log(model.result);
  }

  console.log('// Generator output as Record');
  const modelsRecord = await generatorRecord.generate(jsonSchemaDraft7);
  for (const model of modelsRecord) {
    console.log(model.result);
  }
}

if (require.main === module) {
  generate();
}
