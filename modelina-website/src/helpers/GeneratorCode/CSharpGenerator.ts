/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaCSharpOptions } from '../../types';
import { getGeneralGeneratorCode, renderGeneratorInstanceCode } from './GeneralGenerator';

export function getCSharpGeneratorCode(
  generatorOptions: ModelinaCSharpOptions
) {
  const optionString: string[] = getGeneralGeneratorCode(generatorOptions, 'csharpDefaultEnumKeyConstraints', 'csharpDefaultPropertyKeyConstraints', 'csharpDefaultModelNameConstraints');
  const optionStringPresets: string[] = [];

  if (generatorOptions.csharpArrayType) {
    optionString.push(`collectionType: '${generatorOptions.csharpArrayType}'`);
  }

  if (generatorOptions.csharpAutoImplemented) {
    optionString.push(
      `autoImplementedProperties: ${generatorOptions.csharpAutoImplemented}`
    );
  }

  if(generatorOptions.showTypeMappingExample === true) {
    optionString.push(`typeMapping: {
  Integer: ({ dependencyManager, constrainedModel, options, partOfProperty }) => {
    // Add custom dependency for your type if required.
    dependencyManager.addDependency('using My.Namespace;');

    //Return the type for the integer model
    return 'MyIntegerType';
  }
}`);
  }

  if (generatorOptions.csharpOverwriteHashcode) {
    optionStringPresets.push(`{
  preset: CSHARP_COMMON_PRESET,
  options: {
    equal: false,
    hashCode: true
  }
}`)
  }

  if (generatorOptions.csharpIncludeJson) {
    optionStringPresets.push(`CSHARP_JSON_SERIALIZER_PRESET`)
  }
  if (generatorOptions.csharpIncludeNewtonsoft) {
    optionStringPresets.push(`
    CSHARP_NEWTONSOFT_SERIALIZER_PRESET
    `)
  }

  if(generatorOptions.csharpOverwriteEqual){
    optionStringPresets.push(`{
  preset: CSHARP_COMMON_PRESET,
  options: {
    equal: true,
    hashCode: true
  }
}`);
  }

<<<<<<< HEAD
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
=======
  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'CSharpGenerator');
>>>>>>> cd72322f86251ce1f78049cc4d7908195f2647ae

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { 
  CSharpGenerator, 
  IndentationTypes, 
  FormatHelpers, 
  csharpDefaultEnumKeyConstraints, 
  csharpDefaultModelNameConstraints, 
  csharpDefaultPropertyKeyConstraints 
} from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
