import { Logger, ModelLoggingInterface, JavaScriptGenerator, JavaScriptOptions } from "../../../";
import { convertModelsToProps } from "./Helpers";
import { ModelinaJavaScriptOptions, ModelProps } from "../types";

/**
 * This is the server side part of the JavaScript generator, that takes input and generator parameters and generate the models.
 */
export async function getJavaScriptModels(input: object, generatorOptions: ModelinaJavaScriptOptions): Promise<ModelProps[]> {
  let options: Partial<JavaScriptOptions> = {
    presets: []
  };

  try {
    const generator = new JavaScriptGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, { exportType: 'default' });
    const propModels = convertModelsToProps(generatedModels);
    return propModels;
  } catch (e) {
    console.error("Could not generate models");
    console.error(e);
  }
  return [];
}

export function getJavaScriptGeneratorCode(generatorOptions: ModelinaJavaScriptOptions) {
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
  const generateInstanceCode = `const generator = new JavaScriptGenerator(${fullOptions});`.replace(/^\s*\n/gm, '');

  const generatorCode = `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { JavaScriptGenerator } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
  return generatorCode;
}