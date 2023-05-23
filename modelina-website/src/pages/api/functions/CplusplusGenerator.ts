/* eslint-disable @typescript-eslint/no-unused-vars */
import { CplusplusGenerator, CplusplusOptions } from '../../../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaCplusplusOptions, ModelProps } from '../../../types';

/**
 * This is the server side part of the C++ generator, that takes input and generator parameters and generate the models.
 */
export async function getCplusplusModels(
  input: any,
  generatorOptions: ModelinaCplusplusOptions
): Promise<ModelProps[]> {
  const options: Partial<CplusplusOptions> = {
    presets: []
  };

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
