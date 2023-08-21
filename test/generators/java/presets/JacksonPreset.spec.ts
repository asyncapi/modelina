import { AsyncapiV2Schema } from '../../../../src';
import { JavaGenerator, JAVA_JACKSON_PRESET } from '../../../../src/generators';

describe('JAVA_JACKSON_PRESET', () => {
  let generator: JavaGenerator;
  beforeEach(() => {
    generator = new JavaGenerator({ presets: [JAVA_JACKSON_PRESET] });
  });

  test('should render Jackson annotations for class', async () => {
    const doc = {
      $id: 'Clazz',
      type: 'object',
      properties: {
        min_number_prop: { type: 'number' },
        max_number_prop: { type: 'number' }
      },
      required: ['min_number_prop']
    };
    const expectedDependencies = [
      'import java.util.Map;',
      'import com.fasterxml.jackson.annotation.*;'
    ];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should render Jackson annotations for enum', async () => {
    const doc = {
      $id: 'Enum',
      type: 'string',
      description: 'Description for enum',
      examples: ['value'],
      enum: ['on', 'off']
    };

    const expectedDependencies = ['import com.fasterxml.jackson.annotation.*;'];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  describe('union', () => {
    test('handle oneOf with AsyncAPI discriminator with Jackson', async () => {
      const asyncapiDoc = {
        asyncapi: '2.6.0',
        info: {
          title: 'Vehicle',
          version: '1.0.0'
        },
        channels: {},
        components: {
          messages: {
            Vehicle: {
              payload: {
                title: 'Vehicle',
                discriminator: 'vehicleType',
                oneOf: [
                  { $ref: '#/components/schemas/Car' },
                  { $ref: '#/components/schemas/Truck' }
                ]
              }
            }
          },
          schemas: {
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
        }
      };

      const models = await generator.generate(asyncapiDoc);
      expect(models.map((model) => model.result)).toMatchSnapshot();
    });

    test('handle oneOf with Swagger v2 discriminator with Jackson', async () => {
      const openapiDoc = {
        swagger: '2.0',
        info: {
          title: 'Vehicle',
          version: '1.0.0'
        },
        paths: {
          '/vehicles': {
            get: {
              responses: {
                200: {
                  description: 'successful operation',
                  schema: {
                    type: 'object',
                    title: 'Vehicle',
                    discriminator: 'vehicleType',
                    oneOf: [
                      { $ref: '#/components/schemas/Car' },
                      { $ref: '#/components/schemas/Truck' }
                    ]
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            Car: {
              title: 'Car',
              type: 'object',
              properties: {
                vehicleType: { type: 'string' }
              }
            },
            Truck: {
              title: 'Truck',
              type: 'object',
              properties: {
                vehicleType: { type: 'string' }
              }
            }
          }
        }
      };

      const models = await generator.generate(openapiDoc);
      expect(models.map((model) => model.result)).toMatchSnapshot();
    });

    test('handle oneOf with OpenAPI v3 discriminator with Jackson', async () => {
      const openapiDoc = {
        openapi: '3.0.3',
        info: {
          title: 'Vehicle',
          version: '1.0.0'
        },
        paths: {
          '/vehicles': {
            get: {
              responses: {
                200: {
                  description: 'successful operation',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        title: 'Vehicle',
                        discriminator: { propertyName: 'vehicleType' },
                        oneOf: [
                          { $ref: '#/components/schemas/Car' },
                          { $ref: '#/components/schemas/Truck' }
                        ]
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            Car: {
              title: 'Car',
              type: 'object',
              properties: {
                vehicleType: { type: 'string' }
              }
            },
            Truck: {
              title: 'Truck',
              type: 'object',
              properties: {
                vehicleType: { type: 'string' }
              }
            }
          }
        }
      };

      const models = await generator.generate(openapiDoc);
      expect(models.map((model) => model.result)).toMatchSnapshot();
    });

    test('handle oneOf without discriminator with Jackson deduction', async () => {
      const jsonSchemaDraft7 = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'Vehicle',
        type: 'object',
        oneOf: [
          {
            title: 'Car',
            type: 'object',
            properties: {
              passengers: { type: 'string' }
            }
          },
          {
            title: 'Truck',
            type: 'object',
            properties: {
              cargo: { type: 'string' }
            }
          }
        ]
      };

      const models = await generator.generate(jsonSchemaDraft7);
      expect(models.map((model) => model.result)).toMatchSnapshot();
    });
  });
});
