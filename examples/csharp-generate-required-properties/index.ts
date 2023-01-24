import { CSharpGenerator } from '../../src';

const generator = new CSharpGenerator();
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    requiredBoolean: {
      type: 'boolean'
    },
    notRequiredBoolean: {
      type: 'boolean'
    },
    requiredString: {
      type: 'string'
    },
    notRequiredString: {
      type: 'string'
    }
  },
  required: ['requiredBoolean', 'requiredString']
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
