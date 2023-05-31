/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  InputProcessor,
  PHP_DESCRIPTION_PRESET,
  PhpGenerator,
  PhpOptions,
  phpDefaultEnumKeyConstraints,
  phpDefaultModelNameConstraints,
  phpDefaultPropertyKeyConstraints
} from '../../../../../';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';
import { ModelinaPhpOptions, ModelProps } from '../../../types';
import { DeepPartial } from '../../../../../lib/types/utils';

/**
 * This is the server side part of the PHP generator, that takes input and generator parameters and generate the models.
 */
export async function getPhpModels(
  input: any,
  generatorOptions: ModelinaPhpOptions
): Promise<ModelProps[]> {
  const options: DeepPartial<PhpOptions> = {
    presets: []
  };

  applyGeneralOptions(generatorOptions, options, phpDefaultEnumKeyConstraints, phpDefaultPropertyKeyConstraints, phpDefaultModelNameConstraints);

  if (generatorOptions.phpIncludeDescriptions === true) {
    options.presets?.push({
      preset: PHP_DESCRIPTION_PRESET,
      options: {}
    });
  }

  if (generatorOptions.showTypeMappingExample === true) {
    options.typeMapping = {
      Integer: ({ dependencyManager }) => {
        dependencyManager.addDependency('use ArrayObject');
        return 'ArrayObject';
      }
    }
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
