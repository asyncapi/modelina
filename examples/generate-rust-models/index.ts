import { RustFileGenerator, RustRenderCompleteModelOptions, RUST_COMMON_PRESET, defaultRustRenderCompleteModelOptions, RustPackageFeatures, RustGenerator } from '../../src/generators';
import * as path from 'path';

const doc = {
  $id: '_address',
  type: 'object',
  properties: {
    street_name: { type: 'string' },
    city: { type: 'string', description: 'City description' },
    state: { type: 'string' },
    house_number: { type: 'number' },
    marriage: { type: 'boolean', description: 'Status if marriage live in given house' },
    members: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }], },
    tuple_type: { type: 'array', items: [{ type: 'string' }, { type: 'number' }], additionalItems: false },
    array_type: { type: 'array', items: { type: 'string' }, additionalItems: false },
    enum_type: {
      enum: ['Texas', 'Alabama', 'California'],
      default: 'California'
    }
  },
  required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
  additionalProperties: {
    type: 'string'
  },
};

export async function generate(): Promise<void> {
  // initialize the generator from a preset
  const generator = new RustGenerator();

  const models = await generator.generate(doc);
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
