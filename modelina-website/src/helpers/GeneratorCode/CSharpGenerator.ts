/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaCSharpOptions } from '../../types';

export function getCSharpGeneratorCode(
  generatorOptions: ModelinaCSharpOptions
) {
  const optionString: string[] = [];
  const optionStringPresets: string[] = [];

  if (generatorOptions.csharpArrayType) {
    optionString.push(`collectionType: '${generatorOptions.csharpArrayType}'`);
  }

  if (generatorOptions.csharpAutoImplemented) {
    optionString.push(
      `   autoImplementedProperties: ${generatorOptions.csharpAutoImplemented}`
    );
  }

  if (generatorOptions.csharpOverwriteHashcode) {
    optionStringPresets.push(`
    {
      preset: CSHARP_COMMON_PRESET,
      options: {
        equal: false,
        hashCode: true
      }
    }`)
  }

  if (generatorOptions.csharpIncludeJson) {
    optionStringPresets.push(`
    CSHARP_JSON_SERIALIZER_PRESET
    `)
  }
  if (generatorOptions.csharpIncludeNewtonsoft) {
    optionStringPresets.push(`
    CSHARP_NEWTONSOFT_SERIALIZER_PRESET
    `)
  }

  if(generatorOptions.csharpOverwriteEqual){
    optionStringPresets.push(`
    {
      preset: CSHARP_COMMON_PRESET,
      options: {
        equal: true,
        hashCode: true
      }
    }
    `)
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
    `const generator = new CSharpGenerator(${fullOptions});`.replace(
      /^\s*\n/gm,
      ''
    );

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { CSharpGenerator } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
