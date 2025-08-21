import { JavaGenerator } from '../../src';

const generator = new JavaGenerator({
  useOptionalForNullableProperties: true
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      default: '123e4567-e89b-12d3-a456-426614174000'
    },
    gender: {
      type: 'string',
      default: 'male'
    },
    age: {
      type: 'integer',
      default: 18
    },
    height: {
      type: 'number',
      default: 1.75
    },
    isEmployed: {
      type: 'boolean',
      default: true
    },
    birthdate: {
      type: 'string',
      format: 'date',
      default: '2000-01-01'
    },
    creationTime: {
      type: 'string',
      format: 'date-time',
      default: '2023-10-01T12:00:00Z'
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
