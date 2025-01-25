import { KotlinGenerator, KOTLIN_CONSTRAINTS_PRESET } from '../../src';

const generator = new KotlinGenerator({
  presets: [
    {
      preset: KOTLIN_CONSTRAINTS_PRESET,
      options: {
        importFrom: 'jakarta'
      }
    }
  ]
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'JakartaAnnotation',
  type: 'object',
  properties: {
    min_number_prop: { type: 'number', minimum: 0 },
    max_number_prop: { type: 'number', exclusiveMaximum: 100 },
    min_number_prop_exclusive: { type: 'number', exclusiveMinimum: 100 },
    array_prop: { type: 'array', minItems: 2, maxItems: 3 },
    string_prop: { type: 'string', pattern: '^I_', minLength: 3 }
  },
  required: ['min_number_prop', 'max_number_prop']
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
