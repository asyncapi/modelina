/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaPhpOptions } from '../../types';

export function getPhpGeneratorCode(generatorOptions: ModelinaPhpOptions) {
  const optionString: string[] = [];
  const optionStringPresets: string[] = [];

  if (generatorOptions.phpIncludeDescriptions === true) {
    optionStringPresets.push(`{
      preset: PHP_DESCRIPTION_PRESET,
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
    `const generator = new PhpGenerator(${fullOptions});`.replace(
      /^\s*\n/gm,
      ''
    );

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { PhpGenerator, PHP_DESCRIPTION_PRESET } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
