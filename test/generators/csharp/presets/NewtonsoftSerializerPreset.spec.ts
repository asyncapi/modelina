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
    // Regression: the additional-properties filter must exclude ALL declared
    // properties, so the checks are joined with `&&`. Joining with `||` is
    // always true for 2+ properties and duplicates declared props into the dictionary.
    const allResults = outputModels.map((model) => model.result).join('\n');
    expect(allResults).toContain(
      'prop.Name != "string prop" && prop.Name != "const string prop"'
    );
    expect(allResults).not.toContain(
      'prop.Name != "string prop" || prop.Name != "const string prop"'
    );
    expect(outputModels[0].result).toMatchSnapshot();
    expect(outputModels[1].result).toMatchSnapshot();
    expect(outputModels[2].result).toMatchSnapshot();
  });
});
