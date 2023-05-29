/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaCSharpOptions } from '../../types';
import { format } from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';

export function getCSharpGeneratorCode(
  generatorOptions: ModelinaCSharpOptions
) {
  const optionString: string[] = [];
  const optionStringPresets: string[] = [];
  const importsString: string[] = [];

  if (generatorOptions.csharpArrayType) {
    optionString.push(`collectionType: '${generatorOptions.csharpArrayType}'`);
  }
  if (generatorOptions.csharpAutoImplemented) {
    optionString.push(`autoImplementedProperties: ${generatorOptions.csharpAutoImplemented}`);
  }
  if (generatorOptions.csharpOverwriteHashcode) {
    importsString.push('CSHARP_COMMON_PRESET')
    optionStringPresets.push(`{
      preset: CSHARP_COMMON_PRESET,
      options: {
        equal: false,
        hashCode: true
      }
    }`)
  }

  if (generatorOptions.csharpIncludeJson) {
    importsString.push('CSHARP_JSON_SERIALIZER_PRESET')
    optionStringPresets.push('CSHARP_JSON_SERIALIZER_PRESET')
  }
  if (generatorOptions.csharpIncludeNewtonsoft) {
    importsString.push('CSHARP_NEWTONSOFT_SERIALIZER_PRESET')
    optionStringPresets.push('CSHARP_NEWTONSOFT_SERIALIZER_PRESET')
  }

  const presetOptions = optionStringPresets.length > 0 ? `presets: [${optionStringPresets.join(',')}]` : '';
  let fullOptions = '';
  if (optionStringPresets.length > 0 || optionString.length > 0) {
    fullOptions = `{ ${optionString.join(',')} , ${presetOptions} }`;
  }

  return format(`// Use the following code as starting point
    // To generate the models exactly as displayed in the playground
    import { CSharpGenerator, ${importsString.length ? importsString.join(',') : ''} } from '@asyncapi/modelina';

    const generator = new CSharpGenerator(${fullOptions});`, 
    {
      semi: true,
      trailingComma: "none",
      parser: "babel",
      plugins: [parserBabel],
    }
  );
}
