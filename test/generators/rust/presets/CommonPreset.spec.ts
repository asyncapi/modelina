import {
  defaultRustRenderCompleteModelOptions,
  RustGenerator,
  RustRenderCompleteModelOptions,
  RUST_COMMON_PRESET,
  defaultRustCommonPresetOptions,
  RustCommonPresetOptions
} from '../../../../src/generators';

describe('RUST_COMMON_PRESET', () => {
  let generator: RustGenerator;
  beforeEach(() => {
    generator = new RustGenerator({ presets: [RUST_COMMON_PRESET] });
  });

  describe('Enum', () => {
    test('should render `enum` without Default implementation', async () => {
      const doc = {
        $id: 'Things',
        enum: ['Texas', 1, '1', false, { test: 'test' }]
      };

      generator = new RustGenerator({
        presets: [
          { preset: RUST_COMMON_PRESET, options: { implementDefault: false } }
        ]
      });

      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });

    test('should render `enum` with mixed types (union type) and Default implementation', async () => {
      const doc = {
        $id: 'Things',
        enum: ['Texas', 1, '1', false, { test: 'test' }]
      };
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });

    test('should render `enum` of union type with Default implementation of string type', async () => {
      const doc = {
        $id: '_address',
        type: 'object',
        properties: {
          members: {
            oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
          },
          optional_members: {
            oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
          }
        },
        required: ['members'],
        additionalProperties: {
          type: 'string'
        }
      };
      const models = await generator.generate(doc);
      expect(models).toHaveLength(3); // Address, Members, OptionalMembers
      expect(models[0].result).toMatchSnapshot();
      expect(models[1].result).toMatchSnapshot();
      expect(models[2].result).toMatchSnapshot();
    });
    test('should render `enum` of union type with Default implementation of integer type', async () => {
      const doc = {
        $id: '_address',
        type: 'object',
        properties: {
          members: {
            oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
          },
          optional_members: {
            oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
          }
        },
        required: ['members'],
        additionalProperties: {
          type: 'string'
        }
      };
      const models = await generator.generate(doc);
      expect(models).toHaveLength(3); // Address, Members, OptionalMembers
      expect(models[0].result).toMatchSnapshot();
      expect(models[1].result).toMatchSnapshot();
      expect(models[2].result).toMatchSnapshot();
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

    test('should render reserved union for dict array', async () => {
      const doc = {
        $id: '_class',
        type: 'object',
        definitions: {
          student: {
            $id: '_student',
            type: 'object',
            properties: {
              name: { type: 'string' },
              birth: { type: 'number' }
            },
            required: ['name', 'birth']
          }
        },
        properties: {
          students: {
            type: 'array',
            items: { $ref: '#/definitions/student' }
          }
        },
        required: ['students']
      };

      const models = await generator.generate(doc);
      expect(models).toHaveLength(2);
      expect(models[0].result).toMatchSnapshot();
      expect(models[1].result).toMatchSnapshot();
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
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
      additionalProperties: {
        type: 'string'
      }
    };

    test('should render `struct` without Default or new() implementation', async () => {
      const options: RustCommonPresetOptions = {
        ...defaultRustCommonPresetOptions,
        implementDefault: false,
        implementNew: false
      };

      generator = new RustGenerator({
        presets: [{ preset: RUST_COMMON_PRESET, options }]
      });

      const models = await generator.generate(doc);
      expect(models).toHaveLength(3);
      expect(models[0].result).toMatchSnapshot();
    });

    test('should render `struct` type with all implementations', async () => {
      const models = await generator.generate(doc);
      expect(models).toHaveLength(3); // Adress, TupleType, and Member models should be generated with default and new implementations
      expect(models[0].result).toMatchSnapshot(); // Address model
      expect(models[1].result).toMatchSnapshot(); // Member model
      expect(models[2].result).toMatchSnapshot(); // TupleType model
    });
  });
});
