import { CSharpGenerator } from '../../src';

const generator = new CSharpGenerator({
  autoImplementedProperties: true,
  handleNullable: true
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  required: ['name', 'age', 'mandatoryFoos', 'applicationDate', 'timestamp'],
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    name: {
      type: 'string'
    },
    age: {
      type: 'integer'
    },
    applicationDate: {
      type: 'string',
      format: 'date'
    },
    timestamp: {
      type: 'string',
      format: 'date-time'
    },
    applicationDate2: {
      type: 'string',
      format: 'date'
    },
    timestamp2: {
      type: 'string',
      format: 'date-time'
    },
    nullableFoos: {
      type: 'array',
      items: {
        type: 'object',
        name: 'Foo'
      }
    },
    mandatoryFoos: {
      type: 'array',
      items: {
        type: 'object',
        name: 'Foo'
      }
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
