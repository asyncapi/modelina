/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaTypeScriptOptions } from '../../types';
import { getGeneralGeneratorCode, renderGeneratorInstanceCode } from './GeneralGenerator';

export function getTypeScriptGeneratorCode(
  generatorOptions: ModelinaTypeScriptOptions
) {
  const optionString: string[] = getGeneralGeneratorCode(generatorOptions, 'typeScriptDefaultEnumKeyConstraints', 'typeScriptDefaultPropertyKeyConstraints', 'typeScriptDefaultModelNameConstraints');
  const optionStringPresets = [];

  if (generatorOptions.tsModelType) {
    optionString.push(`modelType: '${generatorOptions.tsModelType}'`);
  }

  if (generatorOptions.tsMarshalling === true) {
    optionStringPresets.push(`{
  preset: TS_COMMON_PRESET,
  options: {
    marshalling: true
  }
}`);
  }

  if (generatorOptions.tsEnumType) {
    optionString.push(`enumType: '${generatorOptions.tsEnumType}'`);
  }

  if (generatorOptions.tsIncludeDescriptions === true) {
    optionStringPresets.push(`{
  preset: TS_DESCRIPTION_PRESET,
}`);
  }

  if (generatorOptions.tsModuleSystem) {
    optionString.push(`moduleSystem: '${generatorOptions.tsModuleSystem}'`);
  }

  if(generatorOptions.showTypeMappingExample) {
    optionString.push(`typeMapping: {
  Integer: ({ dependencyManager, constrainedModel, options, partOfProperty }) => {
    // Add custom dependency for your type if required. 
    // This support function makes sure that when changing the module system dependencies change accordingly.
    dependencyManager.addTypeScriptDependency('{ MyIntegerType }', './MyIntegerType');

    //Return the type for the integer model
    return 'MyIntegerType';
  }
}`);
  }

  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'TypeScriptGenerator');

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { 
  TS_COMMON_PRESET,
  TS_DESCRIPTION_PRESET,
  TypeScriptGenerator,
  typeScriptDefaultEnumKeyConstraints,
  typeScriptDefaultModelNameConstraints,
  typeScriptDefaultPropertyKeyConstraints
} from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
