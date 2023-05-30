/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaDartOptions } from '../../types';
import { getGeneralGeneratorCode, renderGeneratorInstanceCode } from './GeneralGenerator';

export function getDartGeneratorCode(
  generatorOptions: ModelinaDartOptions
) {
  const optionString: string[] = getGeneralGeneratorCode(generatorOptions, 'dartDefaultEnumKeyConstraints', 'dartDefaultPropertyKeyConstraints', 'dartDefaultModelNameConstraints');
  const optionStringPresets: string[] = [];

  if(generatorOptions.showTypeMappingExample === true) {
    optionString.push(`typeMapping: {
  Integer: ({ dependencyManager, constrainedModel, options, partOfProperty }) => {
    // Add custom dependency for your type if required.
    dependencyManager.addDependency('import 'package:lib/lib.dart' as lib;');

    //Return the type for the integer model
    return 'lib.MyIntegerType';
  }
}`);
  }

  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'DartGenerator');

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { DartGenerator, dartDefaultEnumKeyConstraints, dartDefaultModelNameConstraints, dartDefaultPropertyKeyConstraints } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
