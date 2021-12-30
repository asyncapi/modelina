import {JavaGenerator, JAVA_COMMON_PRESET, JavaCommonPresetOptions} from '../../../../src/generators';

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
      arrayProp: { type: 'array', items: { type: 'string' } },
    },
  };
  test('should render common function in class by common preset', async () => {
    const generator = new JavaGenerator({ presets: [JAVA_COMMON_PRESET] });
    const inputModel = await generator.process(doc);
    const model = inputModel.models['Clazz'];

    const classModel = await generator.renderClass(model, inputModel);
    expect(classModel.result).toMatchSnapshot();
  });
  test('should render accurately when there is no additional properties', async () => {
    const generator = new JavaGenerator({ presets: [JAVA_COMMON_PRESET] });
    const inputModel = await generator.process({...doc, additionalProperties: false});
    const model = inputModel.models['Clazz'];

    const classModel = await generator.renderClass(model, inputModel);
    expect(classModel.result).toMatchSnapshot();
  });
  test('should not render any functions when all 3 options are disabled', async () => {
    const options: JavaCommonPresetOptions = {
      equal: false,
      hashCode: false,
      classToString: false,
    };

    const generator = new JavaGenerator(
      {
        presets: [{
          preset: JAVA_COMMON_PRESET,
          options
        }]
      }
    );
    const inputModel = await generator.process(doc);
    const model = inputModel.models['Clazz'];

    const classModel = await generator.renderClass(model, inputModel);
    expect(classModel.result).toMatchSnapshot();
  });
  describe('with option', () => {
    test('should render all functions', async () => {
      const generator = new JavaGenerator(
        { 
          presets: [{
            preset: JAVA_COMMON_PRESET,
            options: {
              equal: true,
              hashCode: true,
              classToString: true,
            }
          }] 
        }
      );
      const inputModel = await generator.process(doc);
      const model = inputModel.models['Clazz'];
  
      const classModel = await generator.renderClass(model, inputModel);
      expect(classModel.result).toMatchSnapshot();
      expect(classModel.dependencies.includes('import java.util.Objects;')).toEqual(true);
    });
    test('should render equals', async () => {
      const generator = new JavaGenerator(
        { 
          presets: [{
            preset: JAVA_COMMON_PRESET,
            options: {
              equal: true,
              hashCode: false,
              classToString: false,
            }
          }] 
        }
      );
      const inputModel = await generator.process(doc);
      const model = inputModel.models['Clazz'];
  
      const classModel = await generator.renderClass(model, inputModel);
      expect(classModel.result).toMatchSnapshot();
      expect(classModel.dependencies.includes('import java.util.Objects;')).toEqual(true);
    });
    test('should render hashCode', async () => {
      const generator = new JavaGenerator(
        { 
          presets: [{
            preset: JAVA_COMMON_PRESET,
            options: {
              equal: false,
              hashCode: true,
              classToString: false,
            }
          }] 
        }
      );
      const inputModel = await generator.process(doc);
      const model = inputModel.models['Clazz'];
  
      const classModel = await generator.renderClass(model, inputModel);
      expect(classModel.result).toMatchSnapshot();
      expect(classModel.dependencies.includes('import java.util.Objects;')).toEqual(true);
    });
    test('should render classToString', async () => {
      const generator = new JavaGenerator(
        { 
          presets: [{
            preset: JAVA_COMMON_PRESET,
            options: {
              equal: false,
              hashCode: false,
              classToString: true,
            }
          }] 
        }
      );
      const inputModel = await generator.process(doc);
      const model = inputModel.models['Clazz'];
  
      const classModel = await generator.renderClass(model, inputModel);
      expect(classModel.result).toMatchSnapshot();
    });
  });
});
