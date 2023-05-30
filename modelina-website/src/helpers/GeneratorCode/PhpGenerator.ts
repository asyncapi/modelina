/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaPhpOptions } from '../../types';
import { getGeneralGeneratorCode, renderGeneratorInstanceCode } from './GeneralGenerator';

export function getPhpGeneratorCode(generatorOptions: ModelinaPhpOptions) {
  const optionString: string[] = getGeneralGeneratorCode(generatorOptions, 'phpDefaultEnumKeyConstraints', 'phpDefaultPropertyKeyConstraints', 'phpDefaultModelNameConstraints');
  const optionStringPresets: string[] = [];

  if (generatorOptions.phpIncludeDescriptions === true) {
    optionStringPresets.push(`{
    preset: PHP_DESCRIPTION_PRESET,
  }`);
  }

  if(generatorOptions.showTypeMappingExample === true) {
    optionString.push(`typeMapping: {
  Integer: ({ dependencyManager, constrainedModel, options, partOfProperty }) => {
    // Add custom dependency for your type if required. 
    // This support function makes sure that when changing the module system dependencies change accordingly.
    dependencyManager.addDependency('use ArrayObject');

    //Return the type for the integer model
    return 'ArrayObject';
  }
}`);
  }

  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'PhpGenerator');

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { PhpGenerator, PHP_DESCRIPTION_PRESET } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
