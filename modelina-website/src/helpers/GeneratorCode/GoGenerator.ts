/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaGoOptions } from '../../types';
import { getGeneralGeneratorCode, renderGeneratorInstanceCode } from './GeneralGenerator';

export function getGoGeneratorCode(
  generatorOptions: ModelinaGoOptions
) {
  const optionString: string[] = getGeneralGeneratorCode(generatorOptions, 'goDefaultEnumKeyConstraints', 'goDefaultPropertyKeyConstraints', 'goDefaultModelNameConstraints');
  const optionStringPresets: string[] = [];

  if(generatorOptions.showTypeMappingExample === true) {
    optionString.push(`typeMapping: {
  Integer: ({ dependencyManager, constrainedModel, options, partOfProperty }) => {
    // Add custom dependency for your type if required.
    dependencyManager.addDependency('parent "family/father"');

    //Return the type for the integer model
    return 'int64';
  }
}`);
  }

  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'GoGenerator');

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { GoGenerator, goDefaultEnumKeyConstraints, goDefaultModelNameConstraints, goDefaultPropertyKeyConstraints } from '@asyncapi/modelina';

${generateInstanceCode}`;
}
