/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaCplusplusOptions } from '../../types';

export function getCplusplusGeneratorCode(generatorOptions: ModelinaCplusplusOptions) {
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
    `const generator = new CplusplusGenerator(${fullOptions});`.replace(
      /^\s*\n/gm,
      ''
    );

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { CplusplusGenerator } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
