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

  if(generatorOptions.showTypeMappingExample) {
    optionString.push(`typeMapping: {
  Integer: ({ dependencyManager, constrainedModel, options, partOfProperty }) => {
    // Add custom dependency for your type if required.
    dependencyManager.addDependency('using My.Namespace;');

    //Return the type for the integer model
    return 'MyIntegerType';
  }
}`);
  }

  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'CSharpGenerator');

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { CSharpGenerator, csharpDefaultEnumKeyConstraints, csharpDefaultModelNameConstraints, csharpDefaultPropertyKeyConstraints } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
