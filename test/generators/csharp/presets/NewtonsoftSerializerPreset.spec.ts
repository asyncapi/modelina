import {
  CSharpGenerator,
  CSHARP_NEWTONSOFT_SERIALIZER_PRESET
} from '../../../../src/generators';
const doc = {
  $id: 'Test',
  type: 'object',
  additionalProperties: true,
  required: ['string prop'],
  properties: {
    'string prop': { type: 'string' },
    'const string prop': { type: 'string', const: 'abc' },
    notRequiredStringProp: { type: 'string' },
    numberProp: { type: 'number' },
    enumProp: {
      $id: 'EnumTest',
      enum: ['Some enum String', true, { test: 'test' }, 2]
    },
    objectProp: {
      type: 'object',
      $id: 'NestedTest',
      properties: { stringProp: { type: 'string' } }
    }
  },
  patternProperties: {
    '^S(.?)test': {
      type: 'string'
    }
  }
};
describe('Newtonsoft JSON serializer preset', () => {
  test('should render serialize and deserialize converters', async () => {
    const generator = new CSharpGenerator({
      presets: [
        {
          preset: CSHARP_NEWTONSOFT_SERIALIZER_PRESET,
          options: {
            enforceRequired: true
          }
        }
      ]
    });

    const outputModels = await generator.generate(doc);
    expect(outputModels).toHaveLength(3);
    expect(outputModels[0].result).toMatchSnapshot();
    expect(outputModels[1].result).toMatchSnapshot();
    expect(outputModels[2].result).toMatchSnapshot();
  });

  test('should not assign to `const` properties in ReadJson', async () => {
    const generator = new CSharpGenerator({
      presets: [CSHARP_NEWTONSOFT_SERIALIZER_PRESET]
    });

    const outputModels = await generator.generate(doc);
    // `const` properties are rendered as read-only, so assigning to them in
    // ReadJson would not compile (CS0200/CS0131). The deserializer must skip
    // them.
    expect(outputModels[0].result).not.toContain('value.ConstStringProp =');
  });
});
