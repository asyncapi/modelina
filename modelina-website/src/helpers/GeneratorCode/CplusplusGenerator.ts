/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaCplusplusOptions } from '../../types';
import { getGeneralGeneratorCode, renderGeneratorInstanceCode } from './GeneralGenerator';

export function getCplusplusGeneratorCode(
  generatorOptions: ModelinaCplusplusOptions
) {
  const optionString: string[] = getGeneralGeneratorCode(generatorOptions, 'cplusplusDefaultEnumKeyConstraints', 'cplusplusDefaultPropertyKeyConstraints', 'cplusplusDefaultModelNameConstraints');
  const optionStringPresets: string[] = [];

  if (generatorOptions.cplusplusNamespace) {
    optionString.push(`namespace: '${generatorOptions.cplusplusNamespace}'`);
  }

  if(generatorOptions.showTypeMappingExample === true) {
    optionString.push(`typeMapping: {
  Integer: ({ dependencyManager, constrainedModel, options, partOfProperty }) => {
    // Add custom dependency for your type if required.
    dependencyManager.addDependency('#include <MyIntegerType>');

    //Return the type for the integer model
    return 'MyIntegerType';
  }
}`);
  }

  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'CplusplusGenerator');

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { 
  CplusplusGenerator, 
  IndentationTypes, 
  FormatHelpers, 
  cplusplusDefaultEnumKeyConstraints, 
  cplusplusDefaultPropertyKeyConstraints, 
  cplusplusDefaultModelNameConstraints 
} from '@asyncapi/modelina';

${generateInstanceCode}`;
}
