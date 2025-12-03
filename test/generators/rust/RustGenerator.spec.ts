import {
  defaultRustRenderCompleteModelOptions,
  RustGenerator,
  RustRenderCompleteModelOptions
} from '../../../src/generators';

describe('RustGenerator', () => {
  let generator: RustGenerator;
  beforeEach(() => {
    generator = new RustGenerator();
  });

  describe('Enum', () => {
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
    test('should render `enum` type (integer type)', async () => {
      const doc = {
        $id: 'Numbers',
        type: 'integer',
        enum: [0, 1, 2, 3]
      };

      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });

    test('should render `enum` with mixed types (union type)', async () => {
      const doc = {
        $id: 'Things_123',
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

      generator = new RustGenerator({
        presets: [
          {
            enum: {
              self({ content }) {
                return content;
              }
            }
          }
        ]
      });

      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });

    test('should render implement Default for `enum (default provided)', async () => {
      // if Default is not specified, the first item in enum is implemented instead
      const doc = {
        $id: 'CustomEnum',
        type: 'string',
        default: 'Texas',
        enum: ['Texas', 'Alabama', 'California']
      };

      const options = {
        ...defaultRustRenderCompleteModelOptions,
        implementDefault: true,
        packageName: 'test'
      } as RustRenderCompleteModelOptions;

      const models = await generator.generateCompleteModels(doc, options);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });

    test('should render enums with translated special characters', async () => {
      const doc = {
        $id: 'States',
        enum: ['test+', '$test', 'test-', 'test?!', '*test']
      };
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });
  });
  describe('NewType Idiom', () => {
    test('should render boolean model', async () => {
      const doc = {
        title: 'BooleanModel',
        type: 'boolean'
      };
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });
    test('should render integer model', async () => {
      const doc = {
        title: 'IntegerModel',
        type: 'integer'
      };
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });
    test('should render float model', async () => {
      const doc = {
        title: 'FloatModel',
        type: 'number'
      };
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });
    test('should render string model', async () => {
      const doc = {
        title: 'StringModel',
        type: 'string'
      };
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });
    test('should render array model', async () => {
      const doc = {
        title: 'ArrayModel',
        type: 'array',
        items: {
          type: 'string'
        }
      };
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });
  });
  describe('Struct & Complete Models', () => {
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
          items: [{ type: 'string' }, { type: 'number' }],
          additionalItems: false
        },
        array_type: {
          type: 'array',
          items: { type: 'string' },
          additionalItems: false
        }
        // not yet implemented
        // tuple_type_with_untyped_additional_items: { type: 'array', items: [{ type: 'string' }, { type: 'number' }], additionalItems: true },
        // tuple_type_with_typed_additional_items: { type: 'array', items: [{ type: 'string' }, { type: 'number' }], additionalItems: { type: 'string' } },
        // array_type_with_typed_additional_items: { type: 'array', items: { type: 'string' }, additionalItems: { type: 'string' } },
        // array_type_with_any_additional_items: { type: 'array', items: { type: 'string' }, additionalItems: true },
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
      additionalProperties: {
        type: 'string'
      }
      // not yet implemented
      // patternProperties: {
      //     '^S(.?*)test&': {
      //         type: 'string'
      //     }
      // },
    };

    test('should render `struct` type', async () => {
      const models = await generator.generate(doc);
      expect(models).toHaveLength(3); // Adress, TupleType, and Member models should be generated
      expect(models[0].result).toMatchSnapshot(); // Address model
      expect(models[1].result).toMatchSnapshot(); // Member model
      expect(models[2].result).toMatchSnapshot(); // TupleType model
    });

    test('Should render complete models', async () => {
      const options = {
        ...defaultRustRenderCompleteModelOptions,
        implementDefault: true,
        implementNew: true,
        supportFiles: true
      } as RustRenderCompleteModelOptions;

      const models = await generator.generateCompleteModels(doc, options);
      expect(models).toHaveLength(3);
      expect(models[0].result).toMatchSnapshot(); // Address model
      expect(models[1].result).toMatchSnapshot(); // Member model
      expect(models[2].result).toMatchSnapshot(); // TupleType model
    });
  });

  describe('Packaging', () => {
    test('Should render supporting files', async () => {
      const doc = {
        $id: 'Numbers',
        type: 'integer',
        enum: [0, 1, 2, 3]
      };
      const options = {
        ...defaultRustRenderCompleteModelOptions,
        implementDefault: true,
        implementNew: true,
        supportFiles: true
      } as RustRenderCompleteModelOptions;
      const output = await generator.generateCompleteSupport(doc, options);
      expect(output).toHaveLength(2);
      expect(output[0].result).toMatchSnapshot(); // Cargo.toml
      expect(output[1].result).toMatchSnapshot(); // lib.rs
    });
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
              $id: 'Critter',
              discriminator: 'petType',
              oneOf: [
                { $ref: '#/components/schemas/Cat' },
                { $ref: '#/components/schemas/Dog' },
                { $ref: '#/components/schemas/StickInsect' }
              ]
            }
          }
        },
        schemas: {
          Pet: {
            type: 'object',
            additionalProperties: false,
            discriminator: 'petType',
            properties: {
              petType: {
                title: 'PetType',
                type: 'string'
              },
              name: {
                type: 'string'
              }
            },
            required: ['petType', 'name']
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
                    $id: 'HuntingSkill',
                    type: 'string',
                    enum: ['clueless', 'lazy', 'adventurous', 'aggressive']
                  }
                },
                required: ['huntingSkill']
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
                required: ['packSize']
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
                    type: 'string'
                  }
                },
                required: ['color']
              }
            ]
          }
        }
      }
    };

    test('should render', async () => {
      const models = await generator.generate(asyncapiDoc);
      expect(models).toHaveLength(6);
      expect(models.map((model) => model.result)).toMatchSnapshot();

      const cat = models.find((model) => model.modelName === 'Cat');
      expect(cat).not.toBeUndefined();
      expect(cat?.result).toContain('petType');
      expect(cat?.result).toContain('name');
      expect(cat?.result).toContain('huntingSkill');
      expect(cat?.result).not.toContain('packSize');
      expect(cat?.result).not.toContain('color');
    });
  });
});
