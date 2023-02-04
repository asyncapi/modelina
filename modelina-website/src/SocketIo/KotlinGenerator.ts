/* eslint-disable @typescript-eslint/no-unused-vars */
import { KotlinGenerator, KotlinOptions } from '../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaKotlinOptions, ModelProps } from '../types';

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

export function getKotlinGeneratorCode(
  generatorOptions: ModelinaKotlinOptions
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
    `const generator = new KotlinGenerator(${fullOptions});`.replace(
      /^\s*\n/gm,
      ''
    );

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { KotlinGenerator } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
