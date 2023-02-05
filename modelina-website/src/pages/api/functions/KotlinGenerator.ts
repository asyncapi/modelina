/* eslint-disable @typescript-eslint/no-unused-vars */
import { KotlinGenerator, KotlinOptions } from '../../../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaKotlinOptions, ModelProps } from '../../../types';

/**
 * This is the server side part of the Kotlin generator, that takes input and generator parameters and generate the models.
 */
export async function getKotlinModels(
  input: any,
  generatorOptions: ModelinaKotlinOptions
): Promise<ModelProps[]> {
  const options: Partial<KotlinOptions> = {
    presets: []
  };

  try {
    const generator = new KotlinGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {
      packageName: 'asyncapi.models'
    });
    return convertModelsToProps(generatedModels);
  } catch (e) {
    console.error('Could not generate models');
    console.error(e);
  }
  return [];
}
