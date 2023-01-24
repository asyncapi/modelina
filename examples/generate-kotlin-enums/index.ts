import { KotlinGenerator } from '../../src';

const generator = new KotlinGenerator();
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
  $id: 'protocol',
  type: ['string', 'int', 'boolean'],
  enum: ['HTTP', 1, 'HTTPS', true]
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
