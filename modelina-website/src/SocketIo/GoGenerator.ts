import { InputProcessor, Logger, ModelLoggingInterface, TS_COMMON_PRESET, GoGenerator, GoOptions } from "../../../";
import { convertModelsToProps } from "./Helpers";
import { ModelinaGoOptions, ModelProps, SocketIoUpdateMessage } from "../types";

/**
 * This is the server side part of the Go generator, that takes input and generator parameters and generate the models.
 */
export async function getGoModels(input: object, generatorOptions: ModelinaGoOptions): Promise<ModelProps[]> {
  let options: Partial<GoOptions> = {
    presets: []
  };

  try {
    const generator = new GoGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {packageName: 'asyncapi.models'});
    const propModels = convertModelsToProps(generatedModels);
    return propModels;
  } catch (e) {
    console.error("Could not generate models");
    console.error(e);
  }
  return [];
}

export function getGoGeneratorCode(generatorOptions: ModelinaGoOptions) {
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
  const generateInstanceCode = `const generator = new GoGenerator(${fullOptions});`.replace(/^\s*\n/gm, '');

  const generatorCode = `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { GoGenerator } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
  return generatorCode;
}