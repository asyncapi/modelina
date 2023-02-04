import { InputProcessor, Logger, ModelLoggingInterface, TS_COMMON_PRESET, PythonGenerator, PythonOptions } from "../../../";
import { convertModelsToProps } from "./Helpers";
import { ModelinaPythonOptions, ModelProps, SocketIoUpdateMessage } from "../types";

/**
 * This is the server side part of the Python generator, that takes input and generator parameters and generate the models.
 */
export async function getPythonModels(input: object, generatorOptions: ModelinaPythonOptions): Promise<ModelProps[]> {
  let options: Partial<PythonOptions> = {
    presets: []
  };

  try {
    const generator = new PythonGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {packageName: 'asyncapi.models'});
    const propModels = convertModelsToProps(generatedModels);
    return propModels;
  } catch (e) {
    console.error("Could not generate models");
    console.error(e);
  }
  return [];
}

export function getPythonGeneratorCode(generatorOptions: ModelinaPythonOptions) {
  let optionString: string[] = [];
  let optionStringPresets: string[] = [];

  const presetOptions = optionStringPresets.length > 0 ? `${optionString.length > 0 ? ',' : ''}
    presets: [
      ${optionStringPresets.join(', \n')}
    ]` : '';
  let fullOptions = '';
  if (optionStringPresets.length > 0 || optionString.length > 0) {
    fullOptions = `{
    ${optionString.join(';\n')}${presetOptions}
  }`;
  }
  const generateInstanceCode = `const generator = new PythonGenerator(${fullOptions});`.replace(/^\s*\n/gm, '');

  const generatorCode = `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { PythonGenerator } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
  return generatorCode;
}