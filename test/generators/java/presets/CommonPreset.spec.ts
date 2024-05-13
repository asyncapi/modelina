import {
  JavaGenerator,
  JAVA_COMMON_PRESET,
  JavaCommonPresetOptions
} from '../../../../src/generators';

describe('JAVA_COMMON_PRESET', () => {
  const doc = {
    $id: 'Clazz',
    type: 'object',
    required: ['requiredProp'],
    properties: {
      requiredProp: { type: 'boolean' },
      stringProp: { type: 'string' },
      numberProp: { type: 'number' },
      booleanProp: { type: 'boolean' },
      arrayProp: { type: 'array', items: { type: 'string' } }
    }
  };
  test('should render common function in class by common preset', async () => {
    const generator = new JavaGenerator({ presets: [JAVA_COMMON_PRESET] });
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });
  test('should render accurately when there is no additional properties', async () => {
    const generator = new JavaGenerator({ presets: [JAVA_COMMON_PRESET] });
    const models = await generator.generate({
      ...doc,
      additionalProperties: false
    });
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });

  describe('with option', () => {
    test('should render all functions', async () => {
      const generator = new JavaGenerator({
        presets: [
          {
            preset: JAVA_COMMON_PRESET,
            options: {
              equal: true,
              hashCode: true,
              classToString: true,
              marshalling: false
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
      expect(models[0].dependencies).toEqual([
        'import java.util.Map;',
        'import java.util.Objects;'
      ]);
    });
    test('should not render any functions when all 4 options are disabled', async () => {
      const options: JavaCommonPresetOptions = {
        equal: false,
        hashCode: false,
        classToString: false,
        marshalling: false
      };

      const generator = new JavaGenerator({
        presets: [
          {
            preset: JAVA_COMMON_PRESET,
            options
          }
        ]
      });
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });
    test('should render equals', async () => {
      const generator = new JavaGenerator({
        presets: [
          {
            preset: JAVA_COMMON_PRESET,
            options: {
              equal: true,
              hashCode: false,
              classToString: false,
              marshalling: false
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
      expect(models[0].dependencies).toEqual([
        'import java.util.Map;',
        'import java.util.Objects;'
      ]);
    });
    test('should render hashCode', async () => {
      const generator = new JavaGenerator({
        presets: [
          {
            preset: JAVA_COMMON_PRESET,
            options: {
              equal: false,
              hashCode: true,
              classToString: false,
              marshalling: false
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
      expect(models[0].dependencies).toEqual([
        'import java.util.Map;',
        'import java.util.Objects;'
      ]);
    });
    test('should render classToString', async () => {
      const generator = new JavaGenerator({
        presets: [
          {
            preset: JAVA_COMMON_PRESET,
            options: {
              equal: false,
              hashCode: false,
              classToString: true,
              marshalling: false
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
      expect(models[0].dependencies).toEqual(['import java.util.Map;']);
    });
    test('should render un/marshal', async () => {
      const generator = new JavaGenerator({
        presets: [
          {
            preset: JAVA_COMMON_PRESET,
            options: {
              equal: false,
              hashCode: false,
              classToString: false,
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
      expect(models[0].dependencies).toEqual([
        'import java.util.Map;',
        'import java.util.stream;',
        'import org.json.JSONObject;'
      ]);
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
        presets: [
          {
            preset: JAVA_COMMON_PRESET,
            options: {
              equal: true,
              hashCode: true,
              classToString: true,
              marshalling: true
            }
          }
        ],
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
  });
});
