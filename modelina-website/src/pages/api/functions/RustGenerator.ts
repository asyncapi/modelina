/* eslint-disable @typescript-eslint/no-unused-vars */
import { RustGenerator, RustOptions } from '../../../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaRustOptions, ModelProps } from '../../../types';

/**
 * This is the server side part of the Rust generator, that takes input and generator parameters and generate the models.
 */
export async function getRustModels(
  input: any,
  generatorOptions: ModelinaRustOptions
): Promise<ModelProps[]> {
  const options: Partial<RustOptions> = {
    presets: []
  };

  try {
    const generator = new RustGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {});
    return convertModelsToProps(generatedModels);
  } catch (e : any) {
    console.error('Could not generate models');
    console.error(e);
    return e.message;
  }
}
