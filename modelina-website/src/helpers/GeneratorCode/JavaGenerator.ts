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

  if (generatorOptions.javaIncludeJackson) {
    optionStringPresets.push(`JAVA_JACKSON_PRESET`)
  }

  if (generatorOptions.javaIncludeMarshaling) {
    optionStringPresets.push(`{
      preset: JAVA_COMMON_PRESET,
      options: {
        equal: false,
        hashCode: false,
        classToString: false,
        marshalling: true
      }
    }`)
  }

  if (generatorOptions.javaArrayType) {
    optionString.push(`collectionType: '${generatorOptions.javaArrayType}'`);
  }

  if (generatorOptions.javaOverwriteHashcode) {
    optionStringPresets.push(`
    {
      preset: JAVA_COMMON_PRESET,
      options: {
        equal: false,
        hashCode: true,
        classToString: false,
        marshalling: false
      }
    }`)
  }

  if(generatorOptions.javaOverwriteEqual){
    optionStringPresets.push(`{
      preset: JAVA_COMMON_PRESET,
      options: {
        equal: generatorOptions.javaOverwriteEqual,
        hashCode: false,
        classToString: false,
        marshalling: false
      }
    }`);
  }

  if(generatorOptions.javaOverwriteToString){
    optionStringPresets.push(`{
      preset: JAVA_COMMON_PRESET,
      options: {
        equal: false,
        hashCode: false,
        classToString: generatorOptions.javaOverwriteToString,
        marshalling: false
      }
    }`);
  }

  if (generatorOptions.javaJavaDocs) {
    optionStringPresets.push(`JAVA_DESCRIPTION_PRESET`)
  }

  if (generatorOptions.javaJavaxAnnotation) {
    optionStringPresets.push(`JAVA_CONSTRAINTS_PRESET`)
  }

  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'JavaGenerator');

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { 
  JavaGenerator, 
  IndentationTypes, 
  FormatHelpers, 
  javaDefaultEnumKeyConstraints, 
  javaDefaultModelNameConstraints, 
  javaDefaultPropertyKeyConstraints 
} from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
