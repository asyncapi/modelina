import { ScalaGenerator } from '../../src/generators/scala';

const generator = new ScalaGenerator();
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    cache: {
      type: 'integer'
    },
    website: {
      type: 'object',
      additionalProperties: false,
      properties: {
        domain: {
          type: 'string',
          format: 'url'
        },
        protocol: {
          type: 'string',
          enum: ['HTTP', 'HTTPS']
        }
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
