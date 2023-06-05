import {
  TS_COMMON_PRESET,
  IndentationTypes
  TypeScriptOptions
} from '../../src';

/** @type {TypeScriptOptions} */
const config = {
  enumType: 'union',
  modelType: 'interface',
  indentation: {
    size: 10,
    type: IndentationTypes.SPACES
  },
  mapType: 'record',
  renderTypes: false,
  moduleSystem: 'CJS',
  constraints: {
    modelName: (context) => {
      return `Custom${context.modelName}`;
    },
    propertyKey: (context) => {
      return `custom_prop_${context.objectPropertyModel.propertyName}`;
    }
  },
  typeMapping: {
    Any: (context) => {
      // Always map AnyModel to number
      return 'number';
    }
  },
  presets: [
    {
      preset: TS_COMMON_PRESET,
      options: {
        example: true
      }
    },
    {
      preset: TS_COMMON_PRESET,
      options: {
        marshalling: true
      }
    }
  ]
};

export { config };
