import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedStringModel,
  InputMetaModel
} from '../../../src';
import { TypeScriptGenerator } from '../../../src/generators';
import {
  ConstValueRenderer,
  TS_DEFAULT_CONST_VALUE_PRESET
} from '../../../src/generators/typescript/renderers/ConstValueRenderer';
import { TypeScriptDependencyManager } from '../../../src/generators/typescript/TypeScriptDependencyManager';

describe('ConstValueRenderer', () => {
  let renderer: ConstValueRenderer;
  let generator: TypeScriptGenerator;
  let dependencyManager: TypeScriptDependencyManager;

  const createModelWithConstProperties = (
    properties: Record<
      string,
      { type: string; constValue?: string | number | boolean }
    >
  ): ConstrainedObjectModel => {
    const modelProperties: Record<string, ConstrainedObjectPropertyModel> = {};

    for (const [name, prop] of Object.entries(properties)) {
      const propertyModel = new ConstrainedStringModel(name, undefined, {}, prop.type);
      if (prop.constValue !== undefined) {
        propertyModel.options.const = { 
          originalInput: prop.constValue,
          value: prop.constValue 
        };
      }

      modelProperties[name] = new ConstrainedObjectPropertyModel(
        name,
        name,
        true,
        propertyModel
      );
    }

    return new ConstrainedObjectModel('TestModel', undefined, {}, 'object', modelProperties);
  };

  beforeEach(() => {
    generator = new TypeScriptGenerator();
    dependencyManager = new TypeScriptDependencyManager(
      TypeScriptGenerator.defaultOptions
    );
  });

  describe('getConstProperties()', () => {
    test('should return properties with const values', () => {
      const model = createModelWithConstProperties({
        eventType: { type: 'string', constValue: 'EXAMPLE_EVENT' },
        normalProp: { type: 'string' }
      });

      renderer = new ConstValueRenderer(
        TypeScriptGenerator.defaultOptions,
        generator,
        [[TS_DEFAULT_CONST_VALUE_PRESET, {}]],
        model,
        new InputMetaModel(),
        dependencyManager
      );

      const constProps = renderer.getConstProperties();
      expect(constProps).toHaveLength(1);
      expect(constProps[0].propertyName).toBe('eventType');
    });

    test('should return empty array when no const properties exist', () => {
      const model = createModelWithConstProperties({
        normalProp1: { type: 'string' },
        normalProp2: { type: 'number' }
      });

      renderer = new ConstValueRenderer(
        TypeScriptGenerator.defaultOptions,
        generator,
        [[TS_DEFAULT_CONST_VALUE_PRESET, {}]],
        model,
        new InputMetaModel(),
        dependencyManager
      );

      const constProps = renderer.getConstProperties();
      expect(constProps).toHaveLength(0);
    });
  });

  describe('toConstName()', () => {
    beforeEach(() => {
      const model = createModelWithConstProperties({});
      renderer = new ConstValueRenderer(
        TypeScriptGenerator.defaultOptions,
        generator,
        [[TS_DEFAULT_CONST_VALUE_PRESET, {}]],
        model,
        new InputMetaModel(),
        dependencyManager
      );
    });

    test('should convert camelCase to UPPER_SNAKE_CASE', () => {
      expect(renderer.toConstName('eventType')).toBe('EVENT_TYPE');
      expect(renderer.toConstName('myPropertyName')).toBe('MY_PROPERTY_NAME');
      expect(renderer.toConstName('petType')).toBe('PET_TYPE');
    });

    test('should handle single word names', () => {
      expect(renderer.toConstName('name')).toBe('NAME');
      expect(renderer.toConstName('type')).toBe('TYPE');
    });

    test('should handle already uppercase names', () => {
      expect(renderer.toConstName('TYPE')).toBe('TYPE');
    });
  });

  describe('defaultSelf()', () => {
    test('should render exported constants for const properties', async () => {
      const model = createModelWithConstProperties({
        eventType: { type: 'string', constValue: 'EXAMPLE_EVENT' },
        eventStatus: { type: 'string', constValue: 'ACTIVE' }
      });

      renderer = new ConstValueRenderer(
        TypeScriptGenerator.defaultOptions,
        generator,
        [[TS_DEFAULT_CONST_VALUE_PRESET, {}]],
        model,
        new InputMetaModel(),
        dependencyManager
      );

      const result = await renderer.defaultSelf();
      expect(result).toContain("export const EVENT_TYPE = EXAMPLE_EVENT;");
      expect(result).toContain("export const EVENT_STATUS = ACTIVE;");
    });

    test('should return empty string when no const properties exist', async () => {
      const model = createModelWithConstProperties({
        normalProp: { type: 'string' }
      });

      renderer = new ConstValueRenderer(
        TypeScriptGenerator.defaultOptions,
        generator,
        [[TS_DEFAULT_CONST_VALUE_PRESET, {}]],
        model,
        new InputMetaModel(),
        dependencyManager
      );

      const result = await renderer.defaultSelf();
      expect(result.trim()).toBe('');
    });
  });

  describe('TS_DEFAULT_CONST_VALUE_PRESET', () => {
    test('item preset should format string values correctly', () => {
      const model = createModelWithConstProperties({
        eventType: { type: 'string', constValue: 'EXAMPLE_EVENT' }
      });

      renderer = new ConstValueRenderer(
        TypeScriptGenerator.defaultOptions,
        generator,
        [[TS_DEFAULT_CONST_VALUE_PRESET, {}]],
        model,
        new InputMetaModel(),
        dependencyManager
      );

      const property = Object.values(model.properties)[0];
      const result = TS_DEFAULT_CONST_VALUE_PRESET.item!({
        property,
        renderer,
        model,
        inputModel: new InputMetaModel(),
        options: TypeScriptGenerator.defaultOptions,
        content: ''
      });

      expect(result).toBe("export const EVENT_TYPE = EXAMPLE_EVENT;");
    });

    test('item preset should return empty string for non-const properties', () => {
      const model = createModelWithConstProperties({
        normalProp: { type: 'string' }
      });

      renderer = new ConstValueRenderer(
        TypeScriptGenerator.defaultOptions,
        generator,
        [[TS_DEFAULT_CONST_VALUE_PRESET, {}]],
        model,
        new InputMetaModel(),
        dependencyManager
      );

      const property = Object.values(model.properties)[0];
      const result = TS_DEFAULT_CONST_VALUE_PRESET.item!({
        property,
        renderer,
        model,
        inputModel: new InputMetaModel(),
        options: TypeScriptGenerator.defaultOptions,
        content: ''
      });

      expect(result).toBe('');
    });
  });
});
