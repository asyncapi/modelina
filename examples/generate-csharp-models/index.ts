import { CSharpGenerator } from '../../src';

const generator = new CSharpGenerator();
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    today: {
      type: 'string',
      format: 'date-time'
    },
    duration: {
      type: 'string',
      format: 'time'
    },
    userId: {
      type: 'string',
      format: 'uuid'
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
