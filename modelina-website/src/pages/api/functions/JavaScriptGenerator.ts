/* eslint-disable @typescript-eslint/no-unused-vars */
import { JavaScriptGenerator, JavaScriptOptions } from '../../../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaJavaScriptOptions, ModelProps } from '../../../types';

/**
 * This is the server side part of the JavaScript generator, that takes input and generator parameters and generate the models.
 */
export async function getJavaScriptModels(
  input: any,
  generatorOptions: ModelinaJavaScriptOptions
): Promise<ModelProps[]> {
  const options: Partial<JavaScriptOptions> = {
    presets: []
  };

  try {
    const generator = new JavaScriptGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {
      exportType: 'default'
    });
    return convertModelsToProps(generatedModels);
  } catch (e : any) {
    console.error('Could not generate models');
    console.error(e);
    return e.message;
  }
}
