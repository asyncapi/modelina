import { InputProcessor, Logger, ModelLoggingInterface, TS_COMMON_PRESET, JavaGenerator, JavaOptions } from "../../../";
import { convertModelsToProps } from "./Helpers";
import { ModelinaJavaOptions, ModelProps, SocketIoUpdateMessage } from "../types";

/**
 * This is the server side part of the Java generator, that takes input and generator parameters and generate the models.
 */
export async function getJavaModels(input: object, generatorOptions: ModelinaJavaOptions): Promise<ModelProps[]> {
  let options: Partial<JavaOptions> = {
    presets: []
  };

  try {
    const generator = new JavaGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {packageName: 'asyncapi.models'});
    const propModels = convertModelsToProps(generatedModels);
    return propModels;
  } catch (e) {
    console.error("Could not generate models");
    console.error(e);
  }
  return [];
}

export function getJavaGeneratorCode(generatorOptions: ModelinaJavaOptions) {
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
  const generateInstanceCode = `const generator = new JavaGenerator(${fullOptions});`.replace(/^\s*\n/gm, '');

  const generatorCode = `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { JavaGenerator } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
  return generatorCode;
}