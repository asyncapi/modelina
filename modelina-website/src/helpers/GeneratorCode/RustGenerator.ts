/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaRustOptions } from '../../types';
import { getGeneralGeneratorCode, renderGeneratorInstanceCode } from './GeneralGenerator';

export function getRustGeneratorCode(
  generatorOptions: ModelinaRustOptions
) {
  const optionString: string[] = getGeneralGeneratorCode(generatorOptions, 'rustDefaultEnumKeyConstraints', 'rustDefaultPropertyKeyConstraints', 'rustDefaultModelNameConstraints');
  const optionStringPresets: string[] = [];

  if(generatorOptions.showTypeMappingExample === true) {
    optionString.push(`typeMapping: {
  Integer: ({ dependencyManager, constrainedModel, options, partOfProperty }) => {
    // Add custom dependency for your type if required.
    dependencyManager.addDependency('mod my;');

    //Return the type for the integer model
    return 'my::IntegerType';
  }
}`);
  }

  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'RustGenerator');

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { RustGenerator, rustDefaultEnumKeyConstraints, rustDefaultModelNameConstraints, rustDefaultPropertyKeyConstraints } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
