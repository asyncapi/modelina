/* eslint-disable @typescript-eslint/no-unused-vars */
import { RustGenerator, RustOptions } from '../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaRustOptions, ModelProps } from '../types';

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
  } catch (e) {
    console.error('Could not generate models');
    console.error(e);
  }
  return [];
}

export function getRustGeneratorCode(generatorOptions: ModelinaRustOptions) {
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
    `const generator = new RustGenerator(${fullOptions});`.replace(
      /^\s*\n/gm,
      ''
    );

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { RustGenerator } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
