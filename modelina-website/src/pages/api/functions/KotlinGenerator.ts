/* eslint-disable @typescript-eslint/no-unused-vars */
import { KotlinGenerator, KotlinOptions, kotlinDefaultEnumKeyConstraints, kotlinDefaultModelNameConstraints, kotlinDefaultPropertyKeyConstraints } from '../../../../../';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';
import { ModelinaKotlinOptions, ModelProps } from '../../../types';
import { DeepPartial } from '../../../../../lib/types/utils';

/**
 * This is the server side part of the Kotlin generator, that takes input and generator parameters and generate the models.
 */
export async function getKotlinModels(
  input: any,
  generatorOptions: ModelinaKotlinOptions
): Promise<ModelProps[]> {
  const options: DeepPartial<KotlinOptions> = {
    presets: []
  };
  applyGeneralOptions(generatorOptions, options, kotlinDefaultEnumKeyConstraints, kotlinDefaultPropertyKeyConstraints, kotlinDefaultModelNameConstraints);

  if (generatorOptions.showTypeMappingExample) {
    options.typeMapping = {
      Integer: ({ dependencyManager }) => {
        dependencyManager.addDependency('import kotlinx.datetime.*');
        return 'LocalDate';
      }
    }
  }

  try {
    const generator = new KotlinGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {
      packageName: generatorOptions.kotlinPackageName || 'asyncapi.models'
    });
    return convertModelsToProps(generatedModels);
  } catch (e) {
    console.error('Could not generate models');
    console.error(e);
  }
  return [];
}
