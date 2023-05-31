/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  InputProcessor,
  TS_COMMON_PRESET,
  TS_DESCRIPTION_PRESET,
  TS_JSONBINPACK_PRESET,
  TypeScriptGenerator,
  TypeScriptOptions,
  typeScriptDefaultEnumKeyConstraints,
  typeScriptDefaultModelNameConstraints,
  typeScriptDefaultPropertyKeyConstraints
} from '../../../../../';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';
import { ModelinaTypeScriptOptions, ModelProps } from '../../../types';
import { DeepPartial } from '../../../../../lib/types/utils';

/**
 * This is the server side part of the TypeScript generator, that takes input and generator parameters and generate the models.
 */
export async function getTypeScriptModels(
  input: any,
  generatorOptions: ModelinaTypeScriptOptions
): Promise<ModelProps[]> {
  const options: DeepPartial<TypeScriptOptions> = {
    presets: []
  };
  applyGeneralOptions(generatorOptions, options, typeScriptDefaultEnumKeyConstraints, typeScriptDefaultPropertyKeyConstraints, typeScriptDefaultModelNameConstraints);

  if (generatorOptions.tsModelType) {
    options.modelType = generatorOptions.tsModelType as any;
  }

  if (generatorOptions.tsMarshalling === true ||
    generatorOptions.tsIncludeExampleFunction === true) {
    let commonOptions: any = {};
    if(generatorOptions.tsMarshalling === true) {
      commonOptions.marshalling = true;
    }

    if (generatorOptions.tsIncludeExampleFunction === true) {
      commonOptions.example = true;
    }

    options.presets?.push({
      preset: TS_COMMON_PRESET,
      options: commonOptions
    });
  }
  
  if (generatorOptions.tsIncludeJsonBinPack === true) {
    options.presets?.push(TS_JSONBINPACK_PRESET);
  }

  if (generatorOptions.tsIncludeDescriptions === true) {
    options.presets?.push({
      preset: TS_DESCRIPTION_PRESET,
      options: {}
    });
  }

  if (generatorOptions.tsModuleSystem) {
    options.moduleSystem = generatorOptions.tsModuleSystem as any;
  }

  if (generatorOptions.tsEnumType) {
    options.enumType = generatorOptions.tsEnumType as any;
  }

  if (generatorOptions.showTypeMappingExample) {
    options.typeMapping = {
      Integer: ({ dependencyManager }) => {
        dependencyManager.addTypeScriptDependency('{ MyIntegerType }', './MyIntegerType');
        return 'MyIntegerType';
      }
    }
  }

  try {
    const processedInput = await InputProcessor.processor.process(input);
    const generator = new TypeScriptGenerator(options);
    const generatedModels = await generator.generateCompleteModels(
      processedInput,
      { exportType: 'default' }
    );
    return convertModelsToProps(generatedModels);
  } catch (e : any) {
    console.error('Could not generate models');
    console.error(e);
    return e.message;
  }
}
