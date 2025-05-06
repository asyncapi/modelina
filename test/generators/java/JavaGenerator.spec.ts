import {
  JAVA_COMMON_PRESET,
  JAVA_CONSTRAINTS_PRESET,
  JAVA_DESCRIPTION_PRESET,
  JAVA_JACKSON_PRESET,
  JavaGenerator
} from '../../../src/generators';
import objectContaining = jasmine.objectContaining;

describe('JavaGenerator', () => {
  let generator: JavaGenerator;
  beforeEach(() => {
    generator = new JavaGenerator();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should not render reserved keyword', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        enum: { type: 'string' },
        reservedEnum: { type: 'string' }
      },
      additionalProperties: false
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });
  test('should render `class` type', async () => {
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
        }
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type']
    };
    const expectedDependencies = ['import java.util.Map;'];
    const models = await generator.generate(doc);
    expect(models).toHaveLength(4);
    expect(models.map((model) => model.result)).toMatchSnapshot();
    expect(models[3].dependencies).toEqual(expectedDependencies);
  });

  test('should work custom preset for `class` type', async () => {
    const doc = {
      $id: 'CustomClass',
      type: 'object',
      properties: {
        property: { type: 'string' }
      }
    };
    generator = new JavaGenerator({
      presets: [
        {
          class: {
            property({ renderer, property, content }) {
              const annotation = renderer.renderAnnotation(
                'JsonProperty',
                `"${property.propertyName}"`
              );
              return `${annotation}\n${content}`;
            },
            getter({ renderer, property, content }) {
              const annotation = renderer.renderAnnotation(
                'JsonProperty',
                `"${property.propertyName}"`
              );
              return `${annotation}\n${content}`;
            },
            setter({ renderer, property, content }) {
              const annotation = renderer.renderAnnotation(
                'JsonProperty',
                `"${property.propertyName}"`
              );
              return `${annotation}\n${content}`;
            }
          }
        }
      ]
    });
    const expectedDependencies = ['import java.util.Map;'];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should render `enum` type (string type)', async () => {
    const doc = {
      $id: 'States',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California', 'New York']
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render `enum` type (integer type)', async () => {
    const doc = {
      $id: 'Numbers',
      type: 'integer',
      enum: [0, 1, 2, 3]
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render `enum` type (union type)', async () => {
    const doc = {
      $id: 'Union',
      type: ['string', 'integer', 'boolean'],
      enum: ['Texas', 'Alabama', 0, 1, '1', true, { test: 'test' }]
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render custom preset for `enum` type', async () => {
    const doc = {
      $id: 'CustomEnum',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California']
    };

    generator = new JavaGenerator({
      presets: [
        {
          enum: {
            self({ renderer, content }) {
              const annotation = renderer.renderAnnotation('EnumAnnotation');
              return `${annotation}\n${content}`;
            }
          }
        }
      ]
    });

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render enums with translated special characters', async () => {
    const doc = {
      $id: 'States',
      enum: ['test+', 'test', 'test-', 'test?!', '*test']
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render List type for collections', async () => {
    const doc = {
      $id: 'CustomClass',
      type: 'object',
      additionalProperties: false,
      properties: {
        arrayType: { type: 'array' }
      }
    };
    const expectedDependencies = ['import java.util.List;'];

    generator = new JavaGenerator({ collectionType: 'List' });

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should render models and their dependencies', async () => {
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
    const config = { packageName: 'test.packageName' };
    const models = await generator.generateCompleteModels(doc, config);
    expect(models).toHaveLength(5);
    expect(models.map((model) => model.result)).toMatchSnapshot();
  });
  test('should throw error when reserved keyword is used in any part of the package name', async () => {
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
        }
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type']
    };
    const config = { packageName: 'valid.package.correct.class' };
    const expectedError = new Error(
      `You cannot use 'valid.package.correct.class' as a package name, contains reserved keywords: [package, class]`
    );
    await expect(generator.generateCompleteModels(doc, config)).rejects.toEqual(
      expectedError
    );
  });

  describe('allowInheritance', () => {
    test('should create interface for Animal, Pet and Dog', async () => {
      const asyncapiDoc = {
        asyncapi: '2.5.0',
        info: {
          title: 'CloudEvent example',
          version: '1.0.0'
        },
        channels: {
          animal: {
            publish: {
              message: {
                oneOf: [
                  {
                    $ref: '#/components/messages/Boxer'
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
            Boxer: {
              payload: {
                $ref: '#/components/schemas/Boxer'
              }
            },
            Cat: {
              payload: {
                $ref: '#/components/schemas/Cat'
              }
            }
          },
          schemas: {
            Pet: {
              title: 'Pet',
              type: 'object',
              discriminator: 'petType',
              properties: {
                petType: {
                  type: 'string'
                },
                color: {
                  type: 'string'
                }
              },
              required: ['petType']
            },
            Cat: {
              title: 'Cat',
              allOf: [
                {
                  $ref: '#/components/schemas/Pet'
                }
              ]
            },
            Dog: {
              title: 'Dog',
              allOf: [
                {
                  $ref: '#/components/schemas/Pet'
                }
              ]
            },
            Boxer: {
              title: 'Boxer',
              type: 'object',
              allOf: [
                {
                  $ref: '#/components/schemas/Dog'
                }
              ],
              properties: {
                breed: {
                  const: 'Boxer'
                }
              }
            }
          }
        }
      };

      generator = new JavaGenerator({
        presets: [
          JAVA_COMMON_PRESET,
          JAVA_JACKSON_PRESET,
          JAVA_DESCRIPTION_PRESET,
          JAVA_CONSTRAINTS_PRESET
        ],
        collectionType: 'List',
        processorOptions: {
          interpreter: {
            allowInheritance: true
          }
        }
      });

      const models = await generator.generate(asyncapiDoc);
      expect(models.map((model) => model.result)).toMatchSnapshot();
    });
  });

  describe('allowInheritance with discriminator containing a special character', () => {
    test('should create interface for Animal, Pet and Fish', async () => {
      const asyncapiDoc = {
        asyncapi: '2.5.0',
        info: {
          title: 'CloudEvent example',
          version: '1.0.0'
        },
        channels: {
          animal: {
            publish: {
              message: {
                oneOf: [
                  {
                    $ref: '#/components/messages/FlyingFish'
                  },
                  {
                    $ref: '#/components/messages/Bird'
                  }
                ]
              }
            }
          }
        },
        components: {
          messages: {
            FlyingFish: {
              payload: {
                $ref: '#/components/schemas/FlyingFish'
              }
            },
            Bird: {
              payload: {
                $ref: '#/components/schemas/Bird'
              }
            }
          },
          schemas: {
            Pet: {
              title: 'Pet',
              type: 'object',
              discriminator: '@petType',
              properties: {
                '@petType': {
                  type: 'string'
                }
              },
              required: ['@petType']
            },
            Bird: {
              title: 'Bird',
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

      generator = new JavaGenerator({
        presets: [
          JAVA_COMMON_PRESET,
          JAVA_JACKSON_PRESET,
          JAVA_DESCRIPTION_PRESET,
          JAVA_CONSTRAINTS_PRESET
        ],
        collectionType: 'List',
        processorOptions: {
          jsonSchema: {
            allowInheritance: true
          }
        }
      });

      const models = await generator.generate(asyncapiDoc);
      expect(models.map((model) => model.result)).toMatchSnapshot();
    });
  });

  describe('allowInheritance with allOf with caching enabled', () => {
    test('should create interface for Pet without causing infinite loop', async () => {
      const asyncapiDoc = {
        asyncapi: '2.5.0',
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
                  type: 'string'
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

      generator = new JavaGenerator({
        presets: [
          JAVA_COMMON_PRESET,
          JAVA_JACKSON_PRESET,
          JAVA_DESCRIPTION_PRESET,
          JAVA_CONSTRAINTS_PRESET
        ],
        collectionType: 'List',
        processorOptions: {
          jsonSchema: {
            allowInheritance: true,
            disableCache: false
          }
        }
      });

      const models = await generator.generate(asyncapiDoc);
      expect(models.map((model) => model.result)).toMatchSnapshot();
    });
  });

  describe('throw error when allowInheritance enabled with caching disabled', () => {
    test('should throw error cause caching is disabled', async () => {
      const asyncapiDoc = {
        asyncapi: '2.5.0',
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
                  type: 'string'
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

      generator = new JavaGenerator({
        presets: [
          JAVA_COMMON_PRESET,
          JAVA_JACKSON_PRESET,
          JAVA_DESCRIPTION_PRESET,
          JAVA_CONSTRAINTS_PRESET
        ],
        collectionType: 'List',
        processorOptions: {
          jsonSchema: {
            allowInheritance: true,
            disableCache: true
          }
        }
      });

      await expect(generator.generate(asyncapiDoc)).rejects.toEqual(
        new Error(
          'Inheritance is enabled in combination with allOf but cache is disabled. Inheritance will not work as expected.'
        )
      );
    });
  });

  describe('oneOf/discriminator', () => {
    test('should create an interface', async () => {
      const asyncapiDoc = {
        asyncapi: '2.6.0',
        info: {
          title: 'Vehicle example',
          version: '1.0.0'
        },
        channels: {},
        components: {
          messages: {
            Vehicle: {
              payload: {
                title: 'Vehicle',
                type: 'object',
                discriminator: 'vehicleType',
                properties: {
                  vehicleType: {
                    title: 'VehicleType',
                    type: 'string'
                  }
                },
                required: ['vehicleType'],
                oneOf: [
                  {
                    $ref: '#/components/schemas/Car'
                  },
                  {
                    $ref: '#/components/schemas/Truck'
                  }
                ]
              }
            }
          },
          schemas: {
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

    describe('with jackson preset', () => {
      beforeEach(() => {
        generator = new JavaGenerator({
          presets: [
            JAVA_COMMON_PRESET,
            JAVA_JACKSON_PRESET,
            JAVA_DESCRIPTION_PRESET,
            JAVA_CONSTRAINTS_PRESET
          ],
          collectionType: 'List'
        });
      });

      test('handle allOf with const in CloudEvent type', async () => {
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
                  id: {
                    type: 'string'
                  },
                  source: {
                    type: 'string',
                    format: 'uri-reference'
                  },
                  specversion: {
                    type: 'string',
                    const: '1.0'
                  },
                  type: {
                    title: 'CloudEventType',
                    type: 'string'
                  },
                  dataschema: {
                    type: 'string',
                    format: 'uri'
                  },
                  time: {
                    type: 'string',
                    format: 'date-time'
                  }
                },
                required: ['id', 'source', 'specversion', 'type']
              },
              Dog: {
                type: 'object',
                properties: {
                  type: {
                    const: 'Dog'
                  }
                }
              },
              Cat: {
                type: 'object',
                properties: {
                  type: {
                    const: 'Cat'
                  }
                }
              }
            }
          }
        };

        const models = await generator.generate(asyncapiDoc);
        expect(models.map((model) => model.result)).toMatchSnapshot();

        const dog = models.find((model) => model.modelName === 'Dog');
        expect(dog).not.toBeUndefined();
        expect(dog?.result).toContain(
          'private final CloudEventType type = CloudEventType.DOG;'
        );

        const cat = models.find((model) => model.modelName === 'Cat');
        expect(cat).not.toBeUndefined();
        expect(cat?.result).toContain(
          'private final CloudEventType type = CloudEventType.CAT;'
        );

        const cloudEventType = models.find(
          (model) => model.modelName === 'CloudEventType'
        );
        expect(cloudEventType).not.toBeUndefined();
        expect(cloudEventType?.result).toContain('DOG');
        expect(cloudEventType?.result).toContain('CAT');
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

        const dog = models.find((model) => model.modelName === 'Dog');
        expect(dog).not.toBeUndefined();
        expect(dog?.result).toContain(
          'private final DogType type = DogType.DOG;'
        );

        const cat = models.find((model) => model.modelName === 'Cat');
        expect(cat).not.toBeUndefined();
        expect(cat?.result).toContain(
          'private final CatType type = CatType.CAT;'
        );

        const dogType = models.find((model) => model.modelName === 'DogType');
        expect(dogType).not.toBeUndefined();
        expect(dogType?.result).toContain('DOG');

        const catType = models.find((model) => model.modelName === 'CatType');
        expect(catType).not.toBeUndefined();
        expect(catType?.result).toContain('CAT');
      });

      test('handle one const with discriminator', async () => {
        const asyncapiDoc = {
          asyncapi: '2.6.0',
          info: {
            title: 'CloudEvent2 example',
            version: '1.0.0'
          },
          channels: {
            pet: {
              publish: {
                message: {
                  $ref: '#/components/messages/Dog'
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
              }
            },
            schemas: {
              CloudEvent: {
                title: 'CloudEvent',
                type: 'object',
                discriminator: 'type',
                properties: {
                  id: {
                    type: 'string'
                  },
                  type: {
                    title: 'CloudEventType',
                    type: 'string'
                  }
                },
                required: ['id', 'type']
              },
              Dog: {
                type: 'object',
                properties: {
                  type: {
                    const: 'Dog'
                  }
                }
              }
            }
          }
        };

        const models = await generator.generate(asyncapiDoc);
        expect(models.map((model) => model.result)).toMatchSnapshot();

        const dog = models.find((model) => model.modelName === 'Dog');
        expect(dog).not.toBeUndefined();
        expect(dog?.result).toContain(
          'private final CloudEventType type = CloudEventType.DOG;'
        );

        const cloudEventType = models.find(
          (model) => model.modelName === 'CloudEventType'
        );
        expect(cloudEventType).not.toBeUndefined();
        expect(cloudEventType?.result).toContain('DOG');
      });
      test('should create an interface for child models', async () => {
        const asyncapiDoc = {
          asyncapi: '2.6.0',
          info: {
            title: 'Vehicle example',
            version: '1.0.0'
          },
          channels: {},
          components: {
            messages: {
              Vehicle: {
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
                  }
                },
                required: ['vehicleType'],
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

      test('date-time format should render java.time.OffsetDateTime', async () => {
        const asyncapiDoc = {
          asyncapi: '2.6.0',
          info: {
            title: 'Event API',
            version: 'v1'
          },
          channels: {
            events: {
              subscribe: {
                message: {
                  $ref: '#/components/messages/Event'
                }
              }
            }
          },
          components: {
            messages: {
              Event: {
                title: 'Event',
                payload: {
                  title: 'Event',
                  type: 'object',
                  properties: {
                    action: {
                      title: 'Action',
                      type: 'string',
                      enum: ['ADD', 'UPDATE', 'DELETE']
                    }
                  },
                  required: ['action'],
                  allOf: [
                    {
                      if: {
                        properties: {
                          action: {
                            const: 'ADD'
                          }
                        },
                        required: ['action']
                      },
                      then: {
                        $ref: '#/components/schemas/Event.AddOrUpdate'
                      }
                    },
                    {
                      if: {
                        properties: {
                          action: {
                            const: 'UPDATE'
                          }
                        },
                        required: ['action']
                      },
                      then: {
                        $ref: '#/components/schemas/Event.AddOrUpdate'
                      }
                    }
                  ]
                }
              }
            },
            schemas: {
              'Event.AddOrUpdate': {
                type: 'object',
                properties: {
                  event_time: {
                    type: 'string',
                    format: 'date-time'
                  }
                },
                required: ['event_time']
              }
            }
          }
        };

        const models = await generator.generate(asyncapiDoc);
        expect(models.map((model) => model.result)).toMatchSnapshot();
      });
    });
  });

  describe('with inheritance using records', () => {
    test('should create interface with getters without "get" prefix', async () => {
      const asyncapiDoc = {
        asyncapi: '3.0.0',
        info: {
          title: 'Records succesfully implement interfaces',
          version: '1.0.0'
        },
        channels: {
          ownerCreated: {
            address: 'owner-created',
            messages: {
              OwnerCreated: {
                $ref: '#/components/messages/Owner'
              }
            }
          }
        },
        operations: {
          processOwnerCreated: {
            action: 'receive',
            channel: {
              $ref: '#/channels/ownerCreated'
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
            Pet: {
              title: 'Pet',
              type: 'object',
              discriminator: 'petType',
              properties: {
                petType: {
                  type: 'string'
                },
                color: {
                  type: 'string'
                }
              },
              oneOf: [
                {
                  $ref: '#/components/schemas/Cat'
                },
                {
                  $ref: '#/components/schemas/Dog'
                }
              ],
              required: ['petType', 'color']
            },
            Cat: {
              title: 'Cat',
              allOf: [
                {
                  $ref: '#/components/schemas/Pet'
                }
              ]
            },
            Dog: {
              title: 'Dog',
              allOf: [
                {
                  $ref: '#/components/schemas/Pet'
                }
              ]
            },
            Owner: {
              title: 'Owner',
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                pet: {
                  items: {
                    $ref: '#/components/schemas/Pet'
                  }
                }
              }
            }
          }
        }
      };

      generator = new JavaGenerator({
        presets: [
          JAVA_COMMON_PRESET,
          JAVA_JACKSON_PRESET,
          JAVA_DESCRIPTION_PRESET,
          JAVA_CONSTRAINTS_PRESET
        ],
        modelType: 'record',
        collectionType: 'List',
        processorOptions: {
          jsonSchema: {
            disableCache: false,
            allowInheritance: true,
            ignoreAdditionalProperties: true
          }
        }
      });

      const models = await generator.generate(asyncapiDoc);
      expect(models.map((model) => model.result)).toMatchSnapshot();
    });
  });
});
