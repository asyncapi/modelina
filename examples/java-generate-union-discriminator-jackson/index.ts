import { JavaGenerator, JAVA_JACKSON_PRESET } from '../../src';

const generator = new JavaGenerator({
  presets: [JAVA_JACKSON_PRESET]
});

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Vehicle',
  type: 'object',
  discriminator: 'vehicleType',
  oneOf: [{ $ref: '#/definitions/Car' }, { $ref: '#/definitions/Truck' }],
  definitions: {
    Car: {
      title: 'Car',
      type: 'object',
      properties: {
        vehicleType: { type: 'string' },
        name: { type: 'string' }
      }
    },
    Truck: {
      title: 'Truck',
      type: 'object',
      properties: {
        vehicleType: { type: 'string' },
        name: { type: 'string' }
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
