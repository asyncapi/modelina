/* eslint-disable @typescript-eslint/no-unused-vars */
import { DartGenerator, DartOptions } from '../../../../..';
import { convertModelsToProps } from './Helpers';
import { ModelinaDartOptions, ModelProps } from '../../../types';

/**
 * This is the server side part of the Dart generator, that takes input and generator parameters and generate the models.
 */
export async function getDartModels(
  input: any,
  generatorOptions: ModelinaDartOptions
): Promise<ModelProps[]> {
  const options: Partial<DartOptions> = {
    presets: []
  };

  try {
    const generator = new DartGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {});
    return convertModelsToProps(generatedModels);
  } catch (e : any) {
    console.error('Could not generate models');
    console.error(e);
    return e.message;
  }
}
