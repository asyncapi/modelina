/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  InputProcessor,
  TS_COMMON_PRESET,
  TypeScriptGenerator,
  TypeScriptOptions
} from '../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaTypeScriptOptions, ModelProps } from '../types';

/**
 * This is the server side part of the TypeScript generator, that takes input and generator parameters and generate the models.
 */
export async function getTypeScriptModels(
  input: any,
  generatorOptions: ModelinaTypeScriptOptions
): Promise<ModelProps[]> {
  const options: Partial<TypeScriptOptions> = {
    presets: []
  };

  if (generatorOptions.tsModelType) {
    options.modelType = generatorOptions.tsModelType as any;
  }
  if (generatorOptions.tsMarshalling === true) {
    options.presets?.push({
      preset: TS_COMMON_PRESET,
      options: {
        marshalling: true
      }
    });
  }
  try {
    const processedInput = await InputProcessor.processor.process(input);
    console.log('Processed Input');
    const generator = new TypeScriptGenerator(options);
    const generatedModels = await generator.generateCompleteModels(
      processedInput,
      { exportType: 'default' }
    );
    console.log('DONE');
    return convertModelsToProps(generatedModels);
  } catch (e) {
    console.error('Could not generate models');
    console.error(e);
  }
  return [];
}

export function getTypeScriptGeneratorCode(
  generatorOptions: ModelinaTypeScriptOptions
) {
  const optionString = [];
  const optionStringPresets = [];

  if (generatorOptions.tsModelType) {
    optionString.push(`modelType: '${generatorOptions.tsModelType}'`);
  }

  if (generatorOptions.tsMarshalling === true) {
    optionStringPresets.push(`{
      preset: TS_COMMON_PRESET,
      options: {
        marshalling: true
      }
    }`);
  }

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
    `const generator = new TypeScriptGenerator(${fullOptions});`.replace(
      /^\s*\n/gm,
      ''
    );

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { TypeScriptGenerator, TS_COMMON_PRESET } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
