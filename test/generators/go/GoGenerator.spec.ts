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
        marriage: { type: 'boolean', description: 'Status if marriage live in given house' },
        members: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }], },
        tuple_type: { type: 'array', items: [{ type: 'string' }, { type: 'number' }] },
        array_type: { type: 'array', items: { type: 'string' } },
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
      additionalProperties: {
        type: 'string'
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
    };
    const expected = `// Address represents a Address model.
type Address struct {
  StreetName string
  City string
  State string
  HouseNumber float64
  Marriage bool
  Members []interface{}
  TupleType []interface{}
  ArrayType []string
  AdditionalProperties map[string]string
  STestPatternProperties map[string]string
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['_address'];

    let structModel = await generator.renderStruct(model, inputModel);
    expect(structModel.result).toEqual(expected);
    expect(structModel.dependencies).toEqual([]);

    structModel = await generator.render(model, inputModel);
    expect(structModel.result).toEqual(expected);
    expect(structModel.dependencies).toEqual([]);
  });

  test('should work custom preset for `struct` type', async () => {
    const doc = {
      $id: 'CustomStruct',
      type: 'object',
      properties: {
        property: { type: 'string' },
      },
      additionalProperties: {
        type: 'string'
      }
    };
    const expected = `// CustomStruct represents a CustomStruct model.
type CustomStruct struct {
  property string
  additionalProperties string
}`;

    generator = new GoGenerator({ presets: [
      {
        struct: {
          field({ fieldName, field, renderer }) {
            return `${fieldName} ${renderer.renderType(field)}`; // private fields
          },
        }
      }
    ] });

    const inputModel = await generator.process(doc);
    const model = inputModel.models['CustomStruct'];
    
    const structModel = await generator.render(model, inputModel);
    expect(structModel.result).toEqual(expected);
    expect(structModel.dependencies).toEqual([]);
  });

  describe.each([
    {
      name: 'with enums sharing same type',
      doc: {
        $id: 'States',
        type: 'string',
        enum: ['Texas', 'Alabama', 'California'],
      },
      expected: `// States represents an enum of string.
type States string`,
    },
    {
      name: 'with enums of mixed types',
      doc: {
        $id: 'Things',
        enum: ['Texas', 1, false],
      },
      expected: `// Things represents an enum of mixed types.
type Things interface{}`,
    },
  ])('should render `enum` type $name', ({doc, expected}) => {
    test('should not be empty', async () => {
      const inputModel = await generator.process(doc);
      const model = inputModel.models[doc.$id];

      let enumModel = await generator.render(model, inputModel);
      expect(enumModel.result).toEqual(expected);
      expect(enumModel.dependencies).toEqual([]);
        
      enumModel = await generator.renderEnum(model, inputModel);
      expect(enumModel.result).toEqual(expected);
      expect(enumModel.dependencies).toEqual([]);
    });
  });

  test('should work custom preset for `enum` type', async () => {
    const doc = {
      $id: 'CustomEnum',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California'],
    };
    const expected = `// CustomEnum represents an enum of string.
type CustomEnum string`;

    generator = new GoGenerator({ presets: [
      {
        enum: {
          self({ content }) {
            return content;
          },
        }
      }
    ] });

    const inputModel = await generator.process(doc);
    const model = inputModel.models['CustomEnum'];
    
    let enumModel = await generator.render(model, inputModel);
    expect(enumModel.result).toEqual(expected);
    expect(enumModel.dependencies).toEqual([]);
    
    enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel.result).toEqual(expected);
    expect(enumModel.dependencies).toEqual([]);
  });
});
