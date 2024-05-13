import { GoGenerator } from '../../../src/generators';

describe('GoGenerator', () => {
  let generator: GoGenerator;
  beforeEach(() => {
    generator = new GoGenerator();
  });
  test('should render `struct` type', async () => {
    const doc = {
      $id: '_address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: {
          type: 'boolean',
          description: 'Status if marriage live in given house'
        },
        members: {
          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
        },
        tuple_type: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }]
        },
        array_type: { type: 'array', items: { type: 'string' } }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
      additionalProperties: {
        type: 'string'
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(4);
    expect(models[0].result).toMatchSnapshot();
    expect(models[1].result).toMatchSnapshot();
    expect(models[2].result).toMatchSnapshot();
    expect(models[3].result).toMatchSnapshot();
  });

  test('should render `union` type for primitives', async () => {
    const doc = {
      $id: '_address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: {
          type: 'boolean',
          description: 'Status if marriage live in given house'
        },
        members: {
          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
        },
        tuple_type: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }]
        },
        array_type: { type: 'array', items: { type: 'string' } },
        location: {
          type: 'object',
          additionalProperties: {
            oneOf: [
              { type: 'object', properties: { ref: { type: 'string' } } },
              { type: 'object', properties: { Id: { type: 'string' } } }
            ]
          }
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
      additionalProperties: {
        type: 'string'
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(7);
    const result = models.map((m) => m.result).join('\n');

    expect(result).toMatchSnapshot();
  });

  describe('oneOf/discriminator', () => {
    test('should render interfaces for objects with discriminator', async () => {
      const asyncapiDoc = {
        asyncapi: '2.6.0',
        info: {
          title: 'Vehicle example',
          version: '1.0.0'
        },
        channels: {},
        components: {
          messages: {
            Cargo: {
              payload: {
                title: 'Cargo',
                type: 'object',
                properties: {
                  vehicle: {
                    $ref: '#/components/schemas/Vehicle'
                  }
                }
              }
            }
          },
          schemas: {
            Vehicle: {
              title: 'Vehicle',
              type: 'object',
              discriminator: 'vehicleType',
              properties: {
                vehicleType: {
                  title: 'VehicleType',
                  type: 'string'
                },
                registrationPlate: {
                  title: 'RegistrationPlate',
                  type: 'string'
                }
              },
              required: ['vehicleType', 'registrationPlate'],
              oneOf: [
                {
                  $ref: '#/components/schemas/Car'
                },
                {
                  $ref: '#/components/schemas/Truck'
                }
              ]
            },
            Car: {
              type: 'object',
              properties: {
                vehicleType: {
                  const: 'Car'
                }
              }
            },
            Truck: {
              type: 'object',
              properties: {
                vehicleType: {
                  const: 'Truck'
                }
              }
            }
          }
        }
      };

      const models = await generator.generate(asyncapiDoc);
      expect(models.map((model) => model.result)).toMatchSnapshot();
    });

    test('handle setting title with const', async () => {
      const asyncapiDoc = {
        asyncapi: '2.5.0',
        info: {
          title: 'CloudEvent example',
          version: '1.0.0'
        },
        channels: {
          pet: {
            publish: {
              message: {
                oneOf: [
                  {
                    $ref: '#/components/messages/Dog'
                  },
                  {
                    $ref: '#/components/messages/Cat'
                  }
                ]
              }
            }
          }
        },
        components: {
          messages: {
            Dog: {
              payload: {
                title: 'Dog',
                allOf: [
                  {
                    $ref: '#/components/schemas/CloudEvent'
                  },
                  {
                    $ref: '#/components/schemas/Dog'
                  }
                ]
              }
            },
            Cat: {
              payload: {
                title: 'Cat',
                allOf: [
                  {
                    $ref: '#/components/schemas/CloudEvent'
                  },
                  {
                    $ref: '#/components/schemas/Cat'
                  }
                ]
              }
            }
          },
          schemas: {
            CloudEvent: {
              title: 'CloudEvent',
              type: 'object',
              discriminator: 'type',
              properties: {
                type: {
                  type: 'string'
                }
              },
              required: ['type']
            },
            Dog: {
              type: 'object',
              properties: {
                type: {
                  title: 'DogType',
                  const: 'Dog'
                }
              }
            },
            Cat: {
              type: 'object',
              properties: {
                type: {
                  title: 'CatType',
                  const: 'Cat'
                }
              }
            }
          }
        }
      };

      const models = await generator.generate(asyncapiDoc);
      expect(models.map((model) => model.result)).toMatchSnapshot();
    });
  });

  test('should work custom preset for `struct` type', async () => {
    const doc = {
      $id: 'CustomStruct',
      type: 'object',
      properties: {
        property: { type: 'string' }
      },
      additionalProperties: {
        type: 'string'
      }
    };
    generator = new GoGenerator({
      presets: [
        {
          struct: {
            field({ field }) {
              return `field ${field.propertyName}`;
            },
            additionalContent() {
              return 'additionalContent';
            }
          }
        }
      ]
    });

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });

  test('should render `enum` with mixed types', async () => {
    const doc = {
      $id: 'Things',
      enum: ['Texas', 1, '1', false, { test: 'test' }]
    };
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });

  test('should work custom preset for `enum` type', async () => {
    const doc = {
      $id: 'CustomEnum',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California']
    };

    generator = new GoGenerator({
      presets: [
        {
          enum: {
            item({ index }) {
              return `test ${index}`;
            },
            additionalContent() {
              return 'additionalContent';
            }
          }
        }
      ]
    });

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });
  describe('generateCompleteModels()', () => {
    test('should render models', async () => {
      const doc = {
        $id: 'Address',
        type: 'object',
        properties: {
          street_name: [{ type: 'string' }, { type: 'null' }],
          city: { type: 'string', description: 'City description' },
          state: { type: 'string' },
          house_number: { type: 'number' },
          marriage: {
            type: 'boolean',
            description: 'Status if marriage live in given house'
          },
          members: {
            oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
          },
          array_type: {
            type: 'array',
            items: [{ type: 'string' }, { type: 'number' }]
          },
          other_model: {
            type: 'object',
            $id: 'OtherModel',
            properties: { street_name: { type: 'string' } }
          }
        },
        patternProperties: {
          '^S(.?*)test&': {
            type: 'string'
          }
        },
        required: ['street_name', 'city', 'state', 'house_number', 'array_type']
      };
      const config = { packageName: 'some_package' };
      const models = await generator.generateCompleteModels(doc, config);
      expect(models).toHaveLength(5);
      expect(models[0].result).toMatchSnapshot();
      expect(models[1].result).toMatchSnapshot();
      expect(models[2].result).toMatchSnapshot();
      expect(models[3].result).toMatchSnapshot();
      expect(models[4].result).toMatchSnapshot();
    });

    test('should render dependencies', async () => {
      const doc = {
        $id: 'Address',
        type: 'object',
        properties: {
          street_name: { type: 'string' },
          city: { type: 'string', description: 'City description' },
          state: { type: 'string' },
          house_number: { type: 'number' },
          marriage: {
            type: 'boolean',
            description: 'Status if marriage live in given house'
          },
          members: {
            oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
          },
          array_type: {
            type: 'array',
            items: [{ type: 'string' }, { type: 'number' }]
          },
          other_model: {
            type: 'object',
            $id: 'OtherModel',
            properties: { street_name: { type: 'string' } }
          }
        },
        patternProperties: {
          '^S(.?*)test&': {
            type: 'string'
          }
        },
        required: ['street_name', 'city', 'state', 'house_number', 'array_type']
      };
      generator = new GoGenerator({
        presets: [
          {
            struct: {
              self({ renderer, content }) {
                renderer.dependencyManager.addDependency('time');
                return content;
              }
            }
          }
        ]
      });
      const config = { packageName: 'some_package' };
      const models = await generator.generateCompleteModels(doc, config);
      expect(models).toHaveLength(5);
      expect(models[0].result).toMatchSnapshot();
      expect(models[1].result).toMatchSnapshot();
      expect(models[2].result).toMatchSnapshot();
      expect(models[3].result).toMatchSnapshot();
      expect(models[4].result).toMatchSnapshot();
    });
  });
});
