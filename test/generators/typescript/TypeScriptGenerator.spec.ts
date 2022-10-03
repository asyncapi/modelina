import { TypeScriptGenerator } from '../../../src/generators';

describe('TypeScriptGenerator', () => {
  let generator: TypeScriptGenerator;
  beforeEach(() => {
    generator = new TypeScriptGenerator();
  });

  test('should not render `class` with reserved keyword', async () => {
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
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render `class` type', async () => {
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
        tuple_type_with_additional_items: { type: 'array', items: [{ type: 'string' }, { type: 'number' }], additionalItems: true },
        array_type: { type: 'array', items: { type: 'string' } },
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
    };
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should work custom preset for `class` type', async () => {
    const doc = {
      $id: 'CustomClass',
      type: 'object',
      properties: {
        property: { type: 'string' },
      }
    };

    generator = new TypeScriptGenerator({
      presets: [
        {
          class: {
            property({ property, content }) {
              return `@JsonProperty("${property.propertyName}")
${content}`;
            },
          }
        }
      ]
    });

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render `interface` type', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: { type: 'boolean', description: 'Status if marriage live in given house' },
        members: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }], },
        tuple_type: { type: 'array', items: [{ type: 'string' }, { type: 'number' }], additionalItems: false },
        tuple_type_with_additional_items: { type: 'array', items: [{ type: 'string' }, { type: 'number' }], additionalItems: true },
        array_type: { type: 'array', items: { type: 'string' } },
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
    };

    generator = new TypeScriptGenerator({ modelType: 'interface' });
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should work custom preset for `interface` type', async () => {
    const doc = {
      $id: 'CustomInterface',
      type: 'object',
      properties: {
        property: { type: 'string' },
      }
    };
    const expected = `interface CustomInterface {
  property?: string;
  additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null>;
}`;

    generator = new TypeScriptGenerator({
      presets: [
        {
          interface: {
            self({ content }) {
              return content;
            },
          }
        }
      ]
    });

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render `enum` type', async () => {
    const doc = {
      $id: 'States',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California'],
    };
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render `enum` type as `union` if option enumType = `union`', async () => {
    const doc = {
      $id: 'States',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California'],
    };
    const expected = 'type States = "Texas" | "Alabama" | "California";';

    generator = new TypeScriptGenerator({ enumType: 'union' });
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render union `enum` values', async () => {
    const doc = {
      $id: 'States',
      enum: [2, '2', 'test', true, { test: 'test' }]
    };
    const expected = `enum States {
  NUMBER_2 = 2,
  STRING_2 = "2",
  TEST = "test",
  TRUE = "true",
  TEST_TEST = '{"test":"test"}',
}`;
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

  test('should work custom preset for `enum` type', async () => {
    const doc = {
      $id: 'CustomEnum',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California'],
    };

    generator = new TypeScriptGenerator({
      presets: [
        {
          enum: {
            self({ content }) {
              return content;
            },
          }
        }
      ]
    });

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render `type` type - primitive', async () => {
    const doc = {
      $id: 'TypePrimitive',
      type: 'string',
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render `type` type - enum', async () => {
    const doc = {
      $id: 'TypeEnum',
      enum: ['Texas', 'Alabama', 'California', 0, 1, false, true],
    };
    
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render `type` type - union', async () => {
    const doc = {
      $id: 'TypeUnion',
      type: ['string', 'number', 'boolean'],
    };
    
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render `type` type - array of primitive type', async () => {
    const doc = {
      $id: 'TypeArray',
      type: 'array',
      items: {
        $id: 'StringArray',
        type: 'string',
      }
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render `type` type - array of union type', async () => {
    const doc = {
      $id: 'TypeArray',
      type: 'array',
      items: {
        $id: 'StringArray',
        type: ['string', 'number', 'boolean'],
      }
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  const doc = {
    $id: 'Address',
    type: 'object',
    properties: {
      street_name: { type: 'string' },
      city: { type: 'string', description: 'City description' },
      state: { type: 'string' },
      house_number: { type: 'number' },
      marriage: { type: 'boolean', description: 'Status if marriage live in given house' },
      members: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }], },
      array_type: { type: 'array', items: [{ type: 'string' }, { type: 'number' }] },
      other_model: { type: 'object', $id: 'OtherModel', properties: { street_name: { type: 'string' } } },
    },
    patternProperties: {
      '^S(.?*)test&': {
        type: 'string'
      }
    },
    required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
  };

  test('should render models and their dependencies for CJS module system', async () => {
    generator = new TypeScriptGenerator({
      moduleSystem: 'CJS'
    });
    const models = await generator.generateCompleteModels(doc, {});
    
    expect(models).toHaveLength(2);
    expect(models[0].result).toMatchSnapshot();
    expect(models[1].result).toMatchSnapshot();
  });

  test('should render models and their dependencies for CJS module system with named exports', async () => {
    generator = new TypeScriptGenerator({
      moduleSystem: 'CJS'
    });
    const models = await generator.generateCompleteModels(doc, {exportType: 'named'});
    expect(models).toHaveLength(2);
    expect(models[0].result).toMatchSnapshot();
    expect(models[1].result).toMatchSnapshot();
  });

  test('should render models and their dependencies for ESM module system', async () => {
    generator = new TypeScriptGenerator({
      moduleSystem: 'ESM'
    });
    const models = await generator.generateCompleteModels(doc, {});
    expect(models).toHaveLength(2);
    expect(models[0].result).toMatchSnapshot();
    expect(models[1].result).toMatchSnapshot();
  });

  test('should render models and their dependencies for ESM module system with named exports', async () => {
    generator = new TypeScriptGenerator({
      moduleSystem: 'ESM'
    });
    const models = await generator.generateCompleteModels(doc, {exportType: 'named'});
    expect(models).toHaveLength(2);
    expect(models[0].result).toMatchSnapshot();
    expect(models[1].result).toMatchSnapshot();
  });

  describe('AsyncAPI with polymorphism', () => {
    const asyncapiDoc = {
      asyncapi: '2.4.0',
      info: {
        title: 'Pet',
        version: '1.0.0'
      },
      channels: {},
      components: {
        messages: {
          PetMessage: {
            payload: {
              oneOf: [
                { $ref: '#/components/schemas/Cat' },
                { $ref: '#/components/schemas/Dog' },
                { $ref: '#/components/schemas/StickInsect' },
              ]
            }
          },
        },
        schemas: {
          Pet: {
            type: 'object',
            additionalProperties: false,
            discriminator: 'petType',
            properties: {
              petType: {
                $id: 'PetType',
                type: 'string'
              },
              name: {
                type: 'string'
              },
            },
            required: [
              'petType',
              'name',
            ],
          },
          Cat: {
            allOf: [
              { $ref: '#/components/schemas/Pet' },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  petType: {
                    const: 'Cat'
                  },
                  huntingSkill: {
                    type: 'string',
                    enum: [
                      'clueless',
                      'lazy',
                      'adventurous',
                      'aggressive'
                    ]
                  }
                },
                required: [
                  'huntingSkill'
                ]
              }
            ]
          },
          Dog: {
            allOf: [
              { $ref: '#/components/schemas/Pet' },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  petType: {
                    const: 'Dog'
                  },
                  packSize: {
                    type: 'integer',
                    format: 'int32',
                    description: 'the size of the pack the dog is from',
                    minimum: 0
                  }
                },
                required: [
                  'packSize'
                ]
              }
            ]
          },
          StickInsect: {
            allOf: [
              { $ref: '#/components/schemas/Pet' },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  petType: {
                    const: 'StickBug'
                  },
                  color: {
                    type: 'string',
                  }
                },
                required: [
                  'color'
                ]
              }
            ]
          },
        }
      }
    };

    test('should render 6 models (1 oneOf, 3 classes and 2 enums)', async () => {
      const models = await generator.generate(asyncapiDoc);
      expect(models).toHaveLength(6);
      expect(models.map((model) => model.result)).toMatchSnapshot();

      const cat = models.find((model) => model.modelName === 'Cat');
      expect(cat).not.toBeUndefined();
      expect(cat?.result).toContain('petType');
      expect(cat?.result).toContain('reservedName');
      expect(cat?.result).toContain('huntingSkill');
      expect(cat?.result).not.toContain('packSize');
      expect(cat?.result).not.toContain('color');
    });

    test('should render enum with discriminator', async () => {
      const models = await generator.generate(asyncapiDoc);
      const enums = models.filter(model => model.result.includes('enum'));

      expect(enums).toHaveLength(2);
      const discriminatorEnum = enums[0];
      expect(discriminatorEnum?.modelName).not.toContain('AnonymousSchema');
      // Should contain Cat, Dog, and StickBug
      expect(discriminatorEnum?.result).toMatchSnapshot();
    });
  });

  describe('Combine oneOf and allOf', () => {
    const asyncapiDoc = {
      asyncapi: '2.4.0',
      info: {
        title: 'Carnivora',
        version: '1.0.0'
      },
      channels: {},
      components: {
        messages: {
          Carnivora: {
            payload: {
              title: 'Carnivora',
              allOf: [
                { $ref: '#/components/schemas/Pet' },
              ],
              oneOf: [
                { $ref: '#/components/schemas/Cat' },
                { $ref: '#/components/schemas/Dog' },
              ],
            }
          },
        },
        schemas: {
          Pet: {
            title: 'Pet',
            type: 'object',
            additionalProperties: false,
            discriminator: 'petType',
            properties: {
              petType: {
                title: 'Pet Type',
                type: 'string',
              },
              age: {
                type: 'integer',
                min: 0,
              },
            },
          },
          Cat: {
            title: 'Cat',
            type: 'object',
            additionalProperties: false,
            properties: {
              petType: {
                const: 'Cat'
              },
              huntingSkill: {
                title: 'Hunting Skill',
                type: 'string',
                enum: [
                  'clueless',
                  'lazy',
                ],
              },
            },
          },
          Dog: {
            title: 'Dog',
            type: 'object',
            additionalProperties: false,
            properties: {
              petType: {
                const: 'Dog'
              },
              breed: {
                title: 'Dog Breed',
                type: 'string',
                enum: [
                  'bulldog',
                  'bichons frise',
                ],
              },
            },
          },
        }
      }
    };

    test.only('should combine oneOf and allOf', async () => {
      const models = await generator.generate(asyncapiDoc);
      // expect(models).toHaveLength(6);
      expect(models.map((model) => model.result)).toMatchSnapshot();

      // const cat = models.find((model) => model.modelName === 'Cat');
      // expect(cat).not.toBeUndefined();
      // expect(cat?.result).toContain('petType');
      // expect(cat?.result).toContain('reservedName');
      // expect(cat?.result).toContain('huntingSkill');
      // expect(cat?.result).not.toContain('packSize');
      // expect(cat?.result).not.toContain('color');
    });
  });
});
