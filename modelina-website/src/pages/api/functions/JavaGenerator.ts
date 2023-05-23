/* eslint-disable @typescript-eslint/no-unused-vars */
import { JavaGenerator, JavaOptions } from '../../../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaJavaOptions, ModelProps } from '../../../types';

/**
 * This is the server side part of the Java generator, that takes input and generator parameters and generate the models.
 */
export async function getJavaModels(
  input: any,
  generatorOptions: ModelinaJavaOptions
): Promise<ModelProps[]> {
  const options: Partial<JavaOptions> = {
    presets: []
  };

  try {
    const generator = new JavaGenerator(options);
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
