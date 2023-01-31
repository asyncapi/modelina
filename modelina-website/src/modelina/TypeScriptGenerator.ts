import { Logger, ModelLoggingInterface, TS_COMMON_PRESET, TypeScriptGenerator, TypeScriptOptions } from "../../../";
import { convertModelToProps } from "./Helpers";
import { ModelinaTypeScriptOptions, SocketIoUpdateMessage } from "../types";

/**
 * This is the server side part of the TypeScript generator, that takes input and generator parameters and generate the models.
 */
export async function getTypeScriptCode(input: object, generatorOptions: ModelinaTypeScriptOptions): Promise<SocketIoUpdateMessage> {
  const customLogger: ModelLoggingInterface = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error
  };
  Logger.setLogger(customLogger);
  let options: Partial<TypeScriptOptions> = {
    presets: []
  };
  let optionString = [];
  let optionStringPresets = [];

  if(generatorOptions.tsModelType) {
    options.modelType = generatorOptions.tsModelType as any;
    optionString.push(`modelType: '${generatorOptions.tsModelType}'`);
  }
  if(generatorOptions.tsMarshalling && Boolean(generatorOptions.tsMarshalling) === true) {
    options.presets?.push({
      preset: TS_COMMON_PRESET,
      options: {
        marshalling: true
      }
    });
    optionStringPresets.push(`{
      preset: TS_COMMON_PRESET,
      options: {
        marshalling: true
      }
    }`);
  }
  const generator = new TypeScriptGenerator(options);
  const generatedModels = await generator.generateCompleteModels(input, {exportType: 'default'});
  const propModels = convertModelToProps(generatedModels);
  const presetOptions = optionStringPresets.length > 0 ? `${optionString.length > 0 ? ',' : ''}
  presets: [
    ${optionStringPresets.join(', \n')}
  ]` : '';
  const generateInstanceCode = `const generator = new TypeScriptGenerator({
  ${optionString.join(';\n')}${presetOptions}
});`.replace(/^\s*\n/gm, '');

  const generatorCode = `import { TypeScriptGenerator, TS_COMMON_PRESET } from '@asyncapi/modelina';

${generateInstanceCode}`

  return { models: propModels, generatorCode };
}