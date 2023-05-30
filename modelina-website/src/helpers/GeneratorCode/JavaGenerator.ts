/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaJavaOptions } from '../../types';
import { getGeneralGeneratorCode, renderGeneratorInstanceCode } from './GeneralGenerator';

export function getJavaGeneratorCode(
  generatorOptions: ModelinaJavaOptions
) {
  const optionString: string[] = getGeneralGeneratorCode(generatorOptions, 'javaDefaultEnumKeyConstraints', 'javaDefaultPropertyKeyConstraints', 'javaDefaultModelNameConstraints');
  const optionStringPresets: string[] = [];

  if(generatorOptions.showTypeMappingExample === true) {
    optionString.push(`typeMapping: {
  Integer: ({ dependencyManager, constrainedModel, options, partOfProperty }) => {
    // Add custom dependency for your type if required.
    dependencyManager.addDependency('import java.util.ArrayList;');

    //Return the type for the integer model
    return 'long';
  }
}`);
  }

  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'JavaGenerator');

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { JavaGenerator, javaDefaultEnumKeyConstraints, javaDefaultModelNameConstraints, javaDefaultPropertyKeyConstraints } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
