/* eslint-disable @typescript-eslint/no-unused-vars */
import { JavaScriptGenerator, JavaScriptOptions } from '../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaJavaScriptOptions, ModelProps } from '../types';

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
  } catch (e) {
    console.error('Could not generate models');
    console.error(e);
  }
  return [];
}

export function getJavaScriptGeneratorCode(
  generatorOptions: ModelinaJavaScriptOptions
) {
  const optionString: string[] = [];
  const optionStringPresets: string[] = [];

  const presetOptions =
    optionStringPresets.length > 0
      ? `${optionString.length > 0 ? ',' : ''}
    presets: [
      ${optionStringPresets.join(', \n')}
    ]`
      : '';
  let fullOptions = '';
  if (optionStringPresets.length > 0 || optionString.length > 0) {
    fullOptions = `{
    ${optionString.join(';\n')}${presetOptions}
  }`;
  }
  const generateInstanceCode =
    `const generator = new JavaScriptGenerator(${fullOptions});`.replace(
      /^\s*\n/gm,
      ''
    );

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { JavaScriptGenerator } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
