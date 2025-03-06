import { TypeScriptGenerator } from '../../src';

const generatorEnum = new TypeScriptGenerator({ enumType: 'enum' });
const generatorUnion = new TypeScriptGenerator({ enumType: 'union' });
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    eventType: {
      type: 'string',
      enum: ['ping', 'pong']
    }
  }
};

export async function generate(): Promise<void> {
  console.log('Generator output with Union:');
  const modelsUnion = await generatorUnion.generate(jsonSchemaDraft7);
  for (const model of modelsUnion) {
    console.log(model.result);
  }

  console.log('Generator output with Enum:');
  const modelsEnum = await generatorEnum.generate(jsonSchemaDraft7);
  for (const model of modelsEnum) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
