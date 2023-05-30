/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaTypeScriptOptions } from '../../types';

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

  if (generatorOptions.tsEnumType) {
    optionString.push(`    enumType: '${generatorOptions.tsEnumType}'`);
  }

  if (generatorOptions.tsIncludeDescriptions === true) {
    optionStringPresets.push(`{
      preset: TS_DESCRIPTION_PRESET,
    }`);
  }

  if (generatorOptions.tsModuleSystem) {
    optionString.push(`moduleSystem: '${generatorOptions.tsModuleSystem}'`);
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
