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

  test('should not render anything when isExtended is true', async () => {
    const extend = {
      $id: 'extend',
      type: 'object',
      properties: {
        extendProp: {
          type: 'string'
        }
      }
    };
    const extendDoc = {
      $id: 'extendDoc',
      allOf: [extend]
    };
    const generator = new JavaGenerator({
      presets: [JAVA_JACKSON_PRESET],
      processorOptions: {
        interpreter: {
          allowInheritance: true
        }
      }
    });
    const models = await generator.generate(extendDoc);
    expect(models).toHaveLength(2);
    expect(models.map((model) => model.result)).toMatchSnapshot();
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
                discriminator: 'vehicle_type',
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
                vehicle_type: { type: 'string' },
                name: { type: 'string' }
              }
            },
            Truck: {
              title: 'Truck',
              type: 'object',
              properties: {
                vehicle_type: { type: 'string' },
                name: { type: 'string' }
              }
            }
          }
        }
      };

      const models = await generator.generate(asyncapiDoc);
      expect(models.map((model) => model.result)).toMatchSnapshot();
    });

    test('handle oneOf with default with AsyncAPI with discriminator with Jackson', async () => {
      const asyncapiDoc = {
        asyncapi: '2.6.0',
        info: {
          title: 'CloudEvent example',
          version: '1.0.0'
        },
        channels: {
          owner: {
            publish: {
              message: {
                $ref: '#/components/messages/Owner'
              }
            }
          }
        },
        components: {
          messages: {
            Owner: {
              payload: {
                $ref: '#/components/schemas/Owner'
              }
            }
          },
          schemas: {
            Owner: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                pets: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Pet'
                  }
                }
              }
            },
            Pet: {
              title: 'Pet',
              type: 'object',
              discriminator: 'petType',
              properties: {
                petType: {
                  type: 'string',
                  default: 'Fish'
                }
              },
              required: ['petType'],
              oneOf: [
                {
                  $ref: '#/components/schemas/Fish'
                },
                {
                  $ref: '#/components/schemas/Bird'
                },
                {
                  $ref: '#/components/schemas/FlyingFish'
                }
              ]
            },
            Bird: {
              title: 'Bird',
              properties: {
                breed: {
                  type: String
                }
              },
              allOf: [
                {
                  $ref: '#/components/schemas/Pet'
                }
              ]
            },
            Fish: {
              title: 'Fish',
              allOf: [
                {
                  $ref: '#/components/schemas/Pet'
                }
              ]
            },
            FlyingFish: {
              title: 'FlyingFish',
              type: 'object',
              allOf: [
                {
                  $ref: '#/components/schemas/Fish'
                }
              ],
              properties: {
                breed: {
                  const: 'FlyingNemo'
                }
              }
            }
          }
        }
      };

      const models = await generator.generate(asyncapiDoc);
      expect(models.map((model) => model.result)).toMatchSnapshot();
    });

    test('handle oneOf with default with AsyncAPI 3.0 with custom discriminator with Jackson', async () => {
      const asyncapiDoc = {
        asyncapi: '3.0.0',
        info: {
          title: 'CloudEvent example',
          version: '1.0.0'
        },
        channels: {
          owner: {
            address: 'owner',
            messages: {
              Owner: {
                $ref: '#/components/messages/Owner'
              }
            }
          }
        },
        operations: {
          ownerAvailable: {
            action: 'receive',
            channel: {
              $ref: '#/channels/owner'
            }
          }
        },
        components: {
          messages: {
            Owner: {
              payload: {
                schema: {
                  $ref: '#/components/schemas/Owner'
                }
              }
            }
          },
          schemas: {
            Owner: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                pets: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Pet'
                  }
                }
              }
            },
            Pet: {
              title: 'Pet',
              type: 'object',
              discriminator: 'type',
              properties: {
                type: {
                  type: 'string',
                  title: 'PetType',
                  default: 'Birdie'
                }
              },
              required: ['type'],
              oneOf: [
                {
                  $ref: '#/components/schemas/Fish'
                },
                {
                  $ref: '#/components/schemas/Bird'
                },
                {
                  $ref: '#/components/schemas/Dog'
                }
              ]
            },
            Bird: {
              title: 'Bird',
              type: 'object',
              allOf: [
                {
                  $ref: '#/components/schemas/Pet'
                }
              ],
              properties: {
                type: {
                  const: 'Birdie'
                },
                breed: {
                  type: 'string'
                }
              }
            },
            Fish: {
              title: 'Fish',
              type: 'object',
              allOf: [
                {
                  $ref: '#/components/schemas/Pet'
                }
              ],
              properties: {
                type: {
                  const: 'Fishie'
                }
              }
            },
            Dog: {
              title: 'Dog',
              type: 'object',
              allOf: [
                {
                  $ref: '#/components/schemas/Pet'
                }
              ],
              properties: {
                type: {
                  const: 'Doggie'
                },
                breed: {
                  const: 'Labradoodle'
                }
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
