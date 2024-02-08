import { ModelinaScalaOptions } from '@/types';
import {
  getGeneralGeneratorCode,
  renderGeneratorInstanceCode
} from './GeneralGenerator';

export function getScalaGeneratorCode(generatorOptions: ModelinaScalaOptions) {
  const optionString: string[] = getGeneralGeneratorCode(
    generatorOptions,
    'scalaDefaultEnumKeyConstraints',
    'scalaDefaultPropertyKeyConstraints',
    'scalaDefaultModelNameConstraints'
  );
  const optionStringPresets: string[] = [];

  if (generatorOptions.showTypeMappingExample === true) {
    optionString.push(`typeMapping: {
            Integer: ({ dependencyManager, constrainedModel, options, partOfProperty }) => {
                // Add custom dependency for your type if required.
    dependencyManager.addDependency('mod my;');

    //Return the type for the integer model
    return 'my::IntegerType';
            }
        }`);
  }

  const generateInstanceCode = renderGeneratorInstanceCode(
    optionString,
    optionStringPresets,
    'ScalaGenerator'
  );

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import {
  ScalaGenerator,
  IndentationTypes,
  FormatHelpers,
  scalaDefaultEnumKeyConstraints,
  scalaDefaultModelNameConstraints,
  scalaDefaultPropertyKeyConstraints
} from '@asyncapi/modelina';

${generateInstanceCode}`;
}
