/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaJavaScriptOptions } from '../../types';

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
