/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaPythonOptions } from '../../types';
import { getGeneralGeneratorCode, renderGeneratorInstanceCode } from './GeneralGenerator';

export function getPythonGeneratorCode(
  generatorOptions: ModelinaPythonOptions
) {
  const optionString: string[] = getGeneralGeneratorCode(generatorOptions, 'pythonDefaultEnumKeyConstraints', 'pythonDefaultPropertyKeyConstraints', 'pythonDefaultModelNameConstraints');
  const optionStringPresets: string[] = [];

  const generateInstanceCode = renderGeneratorInstanceCode(optionString, optionStringPresets, 'PythonGenerator');
  
  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { 
  PythonGenerator, 
  IndentationTypes, 
  FormatHelpers, 
  pythonDefaultEnumKeyConstraints, 
  pythonDefaultModelNameConstraints, 
  pythonDefaultPropertyKeyConstraints 
} from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
