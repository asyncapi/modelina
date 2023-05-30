/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaKotlinOptions } from '../../types';
import { getGeneralGeneratorCode, renderGeneratorInstanceCode } from './GeneralGenerator';

export function getKotlinGeneratorCode(
  generatorOptions: ModelinaKotlinOptions
) {
  const optionString: string[] = getGeneralGeneratorCode(generatorOptions, 'kotlinDefaultEnumKeyConstraints', 'kotlinDefaultPropertyKeyConstraints', 'kotlinDefaultModelNameConstraints');
  const optionStringPresets: string[] = [];

  if(generatorOptions.showTypeMappingExample === true) {
    optionString.push(`typeMapping: {
  Integer: ({ dependencyManager, constrainedModel, options, partOfProperty }) => {
    // Add custom dependency for your type if required.
    dependencyManager.addDependency('import kotlinx.datetime.*');

    //Return the type for the integer model
    return 'LocalDate';
  }
}`);
  }

  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'KotlinGenerator');

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { KotlinGenerator, kotlinDefaultEnumKeyConstraints, kotlinDefaultModelNameConstraints, kotlinDefaultPropertyKeyConstraints } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
