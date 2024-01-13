/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaScalaOptions } from '../../types';
import { getGeneralGeneratorCode, renderGeneratorInstanceCode } from './GeneralGenerator';

export function getScalaGeneratorCode(generatorOptions: ModelinaScalaOptions) {
  const optionString: string[] = getGeneralGeneratorCode(generatorOptions, 'scalaDefaultEnumKeyConstraints', 'scalaDefaultPropertyKeyConstraints', 'scalaDefaultModelNameConstraints');
  const optionString: string[] = [];

  if (generatorOptions. === true) {
    optionString.push(`{
    preset: PHP_DESCRIPTION_PRESET,
  }`);
  }

  if(generatorOptions.phpNamespace) {
    optionString.push(`namespace: '${generatorOptions.phpNamespace}'`);
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
import { 
  PhpGenerator, 
  PHP_DESCRIPTION_PRESET, 
  IndentationTypes, 
  FormatHelpers,
  phpDefaultEnumKeyConstraints, 
  phpDefaultPropertyKeyConstraints,
  phpDefaultModelNameConstraints
} from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
