import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator();
const AvroSchemaDoc = {
  name: 'Person',
  namespace: 'com.company',
  type: 'record',
  fields: [
    { name: 'name', type: 'string', example: 'Donkey', minLength: 0 },
    { name: 'serialNo', type: 'string', minLength: 0, maxLength: 50 },
    {
      name: 'email',
      type: ['null', 'string'],
      example: 'donkey@asyncapi.com',
      pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
    },
    {
      name: 'age',
      type: ['null', 'int'],
      default: null,
      example: 123,
      exclusiveMinimum: 0,
      exclusiveMaximum: 200
    },
    {
      name: 'favoriteProgrammingLanguage',
      type: {
        name: 'ProgrammingLanguage',
        type: 'enum',
        symbols: ['JS', 'Java', 'Go', 'Rust', 'C'],
        default: 'JS'
      }
    },
    {
      name: 'certifications',
      type: {
        type: 'array',
        items: 'string',
        minItems: 1,
        maxItems: 500,
        uniqueItems: true
      }
    },
    {
      name: 'address',
      type: {
        name: 'Address',
        type: 'record',
        fields: [
          { name: 'zipcode', type: 'int', example: 53003 },
          { name: 'country', type: ['null', 'string'] }
        ]
      }
    },
    {
      name: 'weight',
      type: 'float',
      example: 65.1,
      minimum: 0,
      maximum: 500
    },
    {
      name: 'height',
      type: 'double',
      example: 1.85,
      minimum: 0,
      maximum: 3.0
    },
    { name: 'someid', type: 'string', logicalType: 'uuid' }
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
