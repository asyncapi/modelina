import { KotlinGenerator, KOTLIN_DESCRIPTION_PRESET } from '../../src';

const generator = new KotlinGenerator({
  presets: [KOTLIN_DESCRIPTION_PRESET]
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'KDoc',
  type: 'object',
  description: 'Description for class',
  examples: [{ prop: 'value' }, { prop: 'test' }],
  properties: {
    prop: {
      type: 'string',
      description: 'Description for prop',
      examples: ['exampleValue']
    },
    enum: {
      type: 'string',
      description: 'Description for enum',
      enum: ['A', 'B', 'C']
    },
    nodesc: { type: 'string' }
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
