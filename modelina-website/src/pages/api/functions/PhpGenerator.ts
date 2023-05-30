/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  InputProcessor,
  PHP_DESCRIPTION_PRESET,
  PhpGenerator,
  PhpOptions
} from '../../../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaPhpOptions, ModelProps } from '../../../types';

/**
 * This is the server side part of the PHP generator, that takes input and generator parameters and generate the models.
 */
export async function getPhpModels(
  input: any,
  generatorOptions: ModelinaPhpOptions
): Promise<ModelProps[]> {
  const options: Partial<PhpOptions> = {
    presets: []
  };
  if (generatorOptions.phpIncludeDescriptions === true) {
    options.presets?.push({
      preset: PHP_DESCRIPTION_PRESET,
      options: {}
    });
  }
  try {
    const processedInput = await InputProcessor.processor.process(input);
    const generator = new PhpGenerator(options);
    const generatedModels = await generator.generateCompleteModels(
      processedInput,
      { namespace: 'asyncapi.models' }
    );
    return convertModelsToProps(generatedModels);
  } catch (e : any) {
    console.error('Could not generate models');
    console.error(e);
    return e.message;
  }
}
