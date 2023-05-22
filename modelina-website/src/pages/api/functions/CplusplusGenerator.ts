/* eslint-disable @typescript-eslint/no-unused-vars */
import { CplusplusDefaultEnumKeyConstraints, CplusplusGenerator, CplusplusOptions, FormatHelpers, IndentationTypes, cplusplusDefaultEnumKeyConstraints, cplusplusDefaultModelNameConstraints, cplusplusDefaultPropertyKeyConstraints } from '../../../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaCplusplusOptions, ModelProps } from '../../../types';
import { DeepPartial } from '../../../../../lib/types/utils';

/**
 * This is the server side part of the C++ generator, that takes input and generator parameters and generate the models.
 */
export async function getCplusplusModels(
  input: any,
  generatorOptions: ModelinaCplusplusOptions
): Promise<ModelProps[]> {
  const options: DeepPartial<CplusplusOptions> = {
    presets: []
  };
  if (generatorOptions.enumKeyNamingFormat !== 'default') {
    switch (generatorOptions.enumKeyNamingFormat) {
      case 'camel_case':
        options.constraints = {
          enumKey: cplusplusDefaultEnumKeyConstraints({
            NAMING_FORMATTER: FormatHelpers.toCamelCase
          })
        }
        break;
      case 'constant_case':
        options.constraints = {
          enumKey: cplusplusDefaultEnumKeyConstraints({
            NAMING_FORMATTER: FormatHelpers.toConstantCase
          })
        }
      case 'param_case':
        options.constraints = {
          enumKey: cplusplusDefaultEnumKeyConstraints({
            NAMING_FORMATTER: FormatHelpers.toParamCase
          })
        }
      case 'pascal_case':
        options.constraints = {
          enumKey: cplusplusDefaultEnumKeyConstraints({
            NAMING_FORMATTER: FormatHelpers.toPascalCase
          })
        }
      case 'snake_case':
        options.constraints = {
          enumKey: cplusplusDefaultEnumKeyConstraints({
            NAMING_FORMATTER: FormatHelpers.toSnakeCase
          })
        }
      default:
        break;
    }
  }
  if (generatorOptions.propertyNamingFormat !== 'default') {
    switch (generatorOptions.enumKeyNamingFormat) {
      case 'camel_case':
        options.constraints = {
          propertyKey: cplusplusDefaultPropertyKeyConstraints({
            NAMING_FORMATTER: FormatHelpers.toCamelCase
          })
        }
        break;
      case 'constant_case':
        options.constraints = {
          propertyKey: cplusplusDefaultPropertyKeyConstraints({
            NAMING_FORMATTER: FormatHelpers.toConstantCase
          })
        }
      case 'param_case':
        options.constraints = {
          propertyKey: cplusplusDefaultPropertyKeyConstraints({
            NAMING_FORMATTER: FormatHelpers.toParamCase
          })
        }
      case 'pascal_case':
        options.constraints = {
          propertyKey: cplusplusDefaultPropertyKeyConstraints({
            NAMING_FORMATTER: FormatHelpers.toPascalCase
          })
        }
      case 'snake_case':
        options.constraints = {
          propertyKey: cplusplusDefaultPropertyKeyConstraints({
            NAMING_FORMATTER: FormatHelpers.toSnakeCase
          })
        }
      default:
        break;
    }
  }
  if (generatorOptions.propertyNamingFormat !== 'default') {
    switch (generatorOptions.enumKeyNamingFormat) {
      case 'camel_case':
        options.constraints = {
          modelName: cplusplusDefaultModelNameConstraints({
            NAMING_FORMATTER: FormatHelpers.toCamelCase
          })
        }
        break;
      case 'constant_case':
        options.constraints = {
          modelName: cplusplusDefaultModelNameConstraints({
            NAMING_FORMATTER: FormatHelpers.toConstantCase
          })
        }
      case 'param_case':
        options.constraints = {
          modelName: cplusplusDefaultModelNameConstraints({
            NAMING_FORMATTER: FormatHelpers.toParamCase
          })
        }
      case 'pascal_case':
        options.constraints = {
          modelName: cplusplusDefaultModelNameConstraints({
            NAMING_FORMATTER: FormatHelpers.toPascalCase
          })
        }
      case 'snake_case':
        options.constraints = {
          modelName: cplusplusDefaultModelNameConstraints({
            NAMING_FORMATTER: FormatHelpers.toSnakeCase
          })
        }
      default:
        break;
    }
  }
  if(generatorOptions.indentationType) {
    switch (generatorOptions.indentationType) {
      case 'spaces':
        options.indentation = {
          type: IndentationTypes.SPACES
        }
        break;
      case 'tabs':
        options.indentation = {
          type: IndentationTypes.TABS
        }
        break;
      default:
        break;
    }
  }
  if(generatorOptions.showCustomFunctionExample) {
    options.presets?.push({
      preset: {
        class: {
          additionalContent: ({content}) => {
            return `${content} \n function customFunctionForClass() {}`;
          }
        },
        enum: {
          additionalContent: ({content}) => {
            return `${content} \n function customFunctionForEnum() {}`;
          }
        }
      }
    });
  }
  if(generatorOptions.showTypeMappingExample) {
    options.typeMapping = {
      Integer: ({dependencyManager}) => {
        // Add custom dependencies for the type mapping.
        dependencyManager.addDependency('import MyFloatType');
        return 'MyFloatType';
      }
    }
  }
  try {
    const generator = new CplusplusGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {
      namespace: 'asyncapi.models'
    });
    return convertModelsToProps(generatedModels);
  } catch (e) {
    console.error('Could not generate models');
    console.error(e);
  }
  return [];
}
