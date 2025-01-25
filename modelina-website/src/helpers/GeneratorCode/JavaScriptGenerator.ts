/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ModelinaJavaScriptOptions } from '../../types';
import { getGeneralGeneratorCode, renderGeneratorInstanceCode } from './GeneralGenerator';

export function getJavaScriptGeneratorCode(generatorOptions: ModelinaJavaScriptOptions) {
  const optionString: string[] = getGeneralGeneratorCode(
    generatorOptions,
    'javaScriptDefaultEnumKeyConstraints',
    'javaScriptDefaultPropertyKeyConstraints',
    'javaScriptDefaultModelNameConstraints'
  );
  const optionStringPresets: string[] = [];

  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'JavaScriptGenerator');

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { 
  JavaScriptGenerator, 
  IndentationTypes, 
  FormatHelpers, 
  javaScriptDefaultEnumKeyConstraints, 
  javaScriptDefaultModelNameConstraints, 
  javaScriptDefaultPropertyKeyConstraints 
} from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
