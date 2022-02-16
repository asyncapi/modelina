import { GoGenerator, GO_DESCRIPTION_PRESET } from '../../../../src/generators';

describe('GO_DESCRIPTION_PRESET', () => {
  let generator: GoGenerator;
  beforeEach(() => {
    generator = new GoGenerator({ presets: [GO_DESCRIPTION_PRESET] });
  });

  test('should render description and examples for struct', async () => {
    const doc = {
      $id: 'Strukt',
      type: 'object',
      description: 'Description for Strukt',
      examples: [{ prop: 'value' }],
      properties: {
        prop: {
          type: 'string',
          description: 'Description for prop',
          examples: ['exampleOne', 'exampleTwo']
        }
      }
    };
    const expected = `// Description for Strukt
type Strukt struct {
  // Description for prop
  Prop string
  AdditionalProperties map[string][]interface{}
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Strukt'];

    const classModel = await generator.renderStruct(model, inputModel);
    expect(classModel.result).toEqual(expected);
  });

  test('should render description and examples for enum', async () => {
    const doc = {
      $id: 'Enum',
      type: 'string',
      description: 'Description for enum',
      examples: ['value'],
      enum: ['on', 'off']
    };
    const expected = `// Description for enum
type Enum string

const (
  EnumOn Enum = "on"
  EnumOff Enum = "off"
)
`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Enum'];

    const enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel.result).toEqual(expected);
  });
});
