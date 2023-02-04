/* eslint-disable @typescript-eslint/no-unused-vars */
import { DartGenerator, DartOptions } from '../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaDartOptions, ModelProps } from '../types';

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
  } catch (e) {
    console.error('Could not generate models');
    console.error(e);
  }
  return [];
}

export function getDartGeneratorCode(generatorOptions: ModelinaDartOptions) {
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
    `const generator = new DartGenerator(${fullOptions});`.replace(
      /^\s*\n/gm,
      ''
    );

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { DartGenerator } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
