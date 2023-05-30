/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelinaTypeScriptOptions } from '../../types';

export function getTypeScriptGeneratorCode(
  generatorOptions: ModelinaTypeScriptOptions
) {
  const optionString = [];
  const optionStringPresets = [];

  if (generatorOptions.tsModelType) {
    optionString.push(`modelType: '${generatorOptions.tsModelType}'`);
  }

  if (generatorOptions.tsMarshalling === true ||
    generatorOptions.tsIncludeExampleFunction === true) {
    let commonOptions: any = {};
    if(generatorOptions.tsMarshalling === true) {
      commonOptions.marshalling = true;
    }

    if (generatorOptions.tsIncludeExampleFunction === true) {
      commonOptions.example = true;
    }

    optionStringPresets.push(`    {
      preset: TS_COMMON_PRESET,
      options: ${JSON.stringify(commonOptions)}
    }`);
  }

  if (generatorOptions.tsEnumType) {
    optionString.push(`  enumType: '${generatorOptions.tsEnumType}'`);
  }

  if (generatorOptions.tsIncludeDescriptions === true) {
    optionStringPresets.push(`    {
      preset: TS_DESCRIPTION_PRESET,
    }`);
  }

  if (generatorOptions.tsIncludeJsonBinPack === true) {
    optionStringPresets.push(`    TS_JSONBINPACK_PRESET`);
  }

  if (generatorOptions.tsModuleSystem) {
    optionString.push(`  moduleSystem: '${generatorOptions.tsModuleSystem}'`);
  }

  const presetOptions =
    optionStringPresets.length > 0
      ? `${optionString.length > 0 ? ',' : ''}
  presets: [
${optionStringPresets.join(', \n')}
  ]`
      : '';
  let fullOptions = '';
  if (optionStringPresets.length > 0 || optionString.length > 0) {
    fullOptions = `{
  ${optionString.join(', \n')}${presetOptions}
}`;
  }
  const generateInstanceCode =
    `const generator = new TypeScriptGenerator(${fullOptions});`.replace(
      /^\s*\n/gm,
      ''
    );

  return `// Use the following code as starting point
// To generate the models exactly as displayed in the playground
import { TypeScriptGenerator, TS_COMMON_PRESET, TS_JSONBINPACK_PRESET } from '@asyncapi/modelina';
  
${generateInstanceCode}`;
}
