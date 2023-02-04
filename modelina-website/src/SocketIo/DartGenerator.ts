import { InputProcessor, Logger, ModelLoggingInterface, TS_COMMON_PRESET, DartGenerator, DartOptions } from "../../../";
import { convertModelsToProps } from "./Helpers";
import { ModelinaDartOptions, ModelProps, SocketIoUpdateMessage } from "../types";

/**
 * This is the server side part of the Dart generator, that takes input and generator parameters and generate the models.
 */
export async function getDartModels(input: object, generatorOptions: ModelinaDartOptions): Promise<ModelProps[]> {
  let options: Partial<DartOptions> = {
    presets: []
  };

  try {
    const generator = new DartGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {});
    const propModels = convertModelsToProps(generatedModels);
    return propModels;
  } catch (e) {
    console.error("Could not generate models");
    console.error(e);
  }
  return [];
}

export function getDartGeneratorCode(generatorOptions: ModelinaDartOptions) {
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
  const generateInstanceCode = `const generator = new DartGenerator(${fullOptions});`.replace(/^\s*\n/gm, '');

  const generatorCode = `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { DartGenerator } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
  return generatorCode;
}