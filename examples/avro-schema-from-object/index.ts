import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator();
const AvroSchemaDoc = {
  name: 'Person',
  namespace: 'com.company',
  type: 'record',
  fields: [
    {
      name: 'name',
      type: 'string',
      example: 'Donkey',
      minLength: 0,
      maxLenght: 20
    }
  ]
};

export async function generate(): Promise<void> {
  const models = await generator.generate(AvroSchemaDoc);
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
