/* eslint-disable @typescript-eslint/no-unused-vars */
import { GoGenerator, GoOptions } from '../../../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaGoOptions, ModelProps } from '../../../types';

/**
 * This is the server side part of the Go generator, that takes input and generator parameters and generate the models.
 */
export async function getGoModels(
  input: any,
  generatorOptions: ModelinaGoOptions
): Promise<ModelProps[]> {
  const options: Partial<GoOptions> = {
    presets: []
  };

  try {
    const generator = new GoGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {
      packageName: 'asyncapi.models'
    });
    return convertModelsToProps(generatedModels);
  } catch (e : any) {
    console.error('Could not generate models');
    console.error(e);
    return e.message;
  }
}
