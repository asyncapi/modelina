import { JavaGenerator } from '../../src';

const generator = new JavaGenerator();

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Vehicle',
  type: 'object',
  discriminator: 'vehicleType',
  oneOf: [
    {
      title: 'Car',
      type: 'object',
      properties: {
        vehicleType: { type: 'string' },
        name: { type: 'string' }
      }
    },
    {
      title: 'Truck',
      type: 'object',
      properties: {
        vehicleType: { type: 'string' },
        name: { type: 'string' }
      }
    }
  ]
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
