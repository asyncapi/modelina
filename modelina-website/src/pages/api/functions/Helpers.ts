import type { OutputModel } from '@/../../';
import { FormatHelpers, IndentationTypes } from '@/../../';
import type { ModelinaGeneralOptions, ModelProps } from '@/types';

/**
 * Converts the output model of Modelina to props
 */
export function convertModelsToProps(generatedModels: OutputModel[]): ModelProps[] {
  return generatedModels.map((model) => {
    return {
      code: model.result,
      name: model.modelName
    };
  });
}

/**
 * Function that applies the general options to the generator options, right before the models are generated.
 *
 * Works for all generators.
 */
export function applyGeneralOptions(
  generatorOptions: ModelinaGeneralOptions,
  opts: Record<any, any>,
  enumKeyConstraints: any,
  propertyKeyConstraints: any,
  modelNameConstraints: any
) {
  const options = opts;

  options.constraints = {};
  if (generatorOptions.enumKeyNamingFormat !== 'default') {
    switch (generatorOptions.enumKeyNamingFormat) {
      case 'camel_case':
        options.constraints.enumKey = enumKeyConstraints({
          NAMING_FORMATTER: FormatHelpers.toCamelCase
        });
        break;
      case 'constant_case':
        options.constraints.enumKey = enumKeyConstraints({
          NAMING_FORMATTER: FormatHelpers.toConstantCase
        });
        break;
      case 'param_case':
        options.constraints.enumKey = enumKeyConstraints({
          NAMING_FORMATTER: FormatHelpers.toParamCase
        });
        break;
      case 'pascal_case':
        options.constraints.enumKey = enumKeyConstraints({
          NAMING_FORMATTER: FormatHelpers.toPascalCase
        });
        break;
      case 'snake_case':
        options.constraints.enumKey = enumKeyConstraints({
          NAMING_FORMATTER: FormatHelpers.toSnakeCase
        });
        break;
      default:
        break;
    }
  }
  if (generatorOptions.propertyNamingFormat !== 'default') {
    switch (generatorOptions.propertyNamingFormat) {
      case 'camel_case':
        options.constraints.propertyKey = propertyKeyConstraints({
          NAMING_FORMATTER: FormatHelpers.toCamelCase
        });
        break;
      case 'constant_case':
        options.constraints.propertyKey = propertyKeyConstraints({
          NAMING_FORMATTER: FormatHelpers.toConstantCase
        });
        break;
      case 'param_case':
        options.constraints.propertyKey = propertyKeyConstraints({
          NAMING_FORMATTER: FormatHelpers.toParamCase
        });
        break;
      case 'pascal_case':
        options.constraints.propertyKey = propertyKeyConstraints({
          NAMING_FORMATTER: FormatHelpers.toPascalCase
        });
        break;
      case 'snake_case':
        options.constraints.propertyKey = propertyKeyConstraints({
          NAMING_FORMATTER: FormatHelpers.toSnakeCase
        });
        break;
      default:
        break;
    }
  }
  if (generatorOptions.modelNamingFormat !== 'default') {
    switch (generatorOptions.modelNamingFormat) {
      case 'camel_case':
        options.constraints.modelName = modelNameConstraints({
          NAMING_FORMATTER: FormatHelpers.toCamelCase
        });
        break;
      case 'constant_case':
        options.constraints.modelName = modelNameConstraints({
          NAMING_FORMATTER: FormatHelpers.toConstantCase
        });
        break;
      case 'param_case':
        options.constraints.modelName = modelNameConstraints({
          NAMING_FORMATTER: FormatHelpers.toParamCase
        });
        break;
      case 'pascal_case':
        options.constraints.modelName = modelNameConstraints({
          NAMING_FORMATTER: FormatHelpers.toPascalCase
        });
        break;
      case 'snake_case':
        options.constraints.modelName = modelNameConstraints({
          NAMING_FORMATTER: FormatHelpers.toSnakeCase
        });
        break;
      default:
        break;
    }
  }
  if (generatorOptions.indentationType) {
    switch (generatorOptions.indentationType) {
      case 'spaces':
        options.indentation = {
          type: IndentationTypes.SPACES
        };
        break;
      case 'tabs':
        options.indentation = {
          type: IndentationTypes.TABS
        };
        break;
      default:
        break;
    }
  }
}
