/* eslint-disable @typescript-eslint/no-unused-vars */
import { JavaScriptGenerator, JavaScriptOptions, javaScriptDefaultEnumKeyConstraints, javaScriptDefaultModelNameConstraints, javaScriptDefaultPropertyKeyConstraints } from '../../../../../';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';
import { ModelinaJavaScriptOptions, ModelProps } from '../../../types';
import { DeepPartial } from '../../../../../lib/types/utils';

/**
 * This is the server side part of the JavaScript generator, that takes input and generator parameters and generate the models.
 */
export async function getJavaScriptModels(
  input: any,
  generatorOptions: ModelinaJavaScriptOptions
): Promise<ModelProps[]> {
  const options: DeepPartial<JavaScriptOptions> = {
    presets: []
  };
  applyGeneralOptions(generatorOptions, options, javaScriptDefaultEnumKeyConstraints, javaScriptDefaultPropertyKeyConstraints, javaScriptDefaultModelNameConstraints);

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
