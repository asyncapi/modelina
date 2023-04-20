/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  InputProcessor,
  TS_COMMON_PRESET,
  TS_DESCRIPTION_PRESET,
  TypeScriptGenerator,
  TypeScriptOptions
} from '../../../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaTypeScriptOptions, ModelProps } from '../../../types';

/**
 * This is the server side part of the TypeScript generator, that takes input and generator parameters and generate the models.
 */
export async function getTypeScriptModels(
  input: any,
  generatorOptions: ModelinaTypeScriptOptions
): Promise<ModelProps[]> {
  const options: Partial<TypeScriptOptions> = {
    presets: []
  };
  if (generatorOptions.tsModelType) {
    options.modelType = generatorOptions.tsModelType as any;
  }
  if (generatorOptions.tsMarshalling === true) {
    options.presets?.push({
      preset: TS_COMMON_PRESET,
      options: {
        marshalling: true
      }
    });
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
