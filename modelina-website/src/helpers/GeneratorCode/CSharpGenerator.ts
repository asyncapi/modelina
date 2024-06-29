/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ModelinaCSharpOptions } from '../../types';
import { getGeneralGeneratorCode, renderGeneratorInstanceCode } from './GeneralGenerator';

export function getCSharpGeneratorCode(generatorOptions: ModelinaCSharpOptions) {
  const optionString: string[] = getGeneralGeneratorCode(
    generatorOptions,
    'csharpDefaultEnumKeyConstraints',
    'csharpDefaultPropertyKeyConstraints',
    'csharpDefaultModelNameConstraints'
  );
  const optionStringPresets: string[] = [];

  if (generatorOptions.csharpArrayType) {
    optionString.push(`collectionType: '${generatorOptions.csharpArrayType}'`);
  }

  if (generatorOptions.csharpAutoImplemented) {
    optionString.push(`autoImplementedProperties: ${generatorOptions.csharpAutoImplemented}`);
  }

  if (generatorOptions.csharpNamespace) {
    optionString.push(`namespace: '${generatorOptions.csharpNamespace}'`);
  }

  if (generatorOptions.csharpNullable) {
    optionString.push(`nullable: ${generatorOptions.csharpNullable}`);
  }

  if (generatorOptions.showTypeMappingExample === true) {
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
}`);
  }

  if (generatorOptions.csharpIncludeJson) {
    optionStringPresets.push('CSHARP_JSON_SERIALIZER_PRESET');
  }
  if (generatorOptions.csharpIncludeNewtonsoft) {
    optionStringPresets.push('CSHARP_NEWTONSOFT_SERIALIZER_PRESET');
  }

  if (generatorOptions.csharpOverwriteEqual) {
    optionStringPresets.push(`{
    preset: CSHARP_COMMON_PRESET,
    options: {
      equal: true,
      hashCode: false
    }
  }`);
  }

  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'CSharpGenerator');

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
