import { TS_COMMON_PRESET, TS_DESCRIPTION_PRESET, TS_JSONBINPACK_PRESET, TypeScriptFileGenerator } from "@asyncapi/modelina";
import { Flags } from "@oclif/core";
import { BuilderReturnType } from "./generate";

export const TypeScriptOclifFlags = {
  tsModelType: Flags.string({
    type: 'option',
    options: ['class', 'interface'],
    description: 'TypeScript specific, define which type of model needs to be generated.',
    required: false,
    default: 'class',
  }),
  tsEnumType: Flags.string({
    type: 'option',
    options: ['enum', 'union'],
    description: 'TypeScript specific, define which type of enums needs to be generated.',
    required: false,
    default: 'enum',
  }),
  tsModuleSystem: Flags.string({
    type: 'option',
    options: ['ESM', 'CJS'],
    description: 'TypeScript specific, define the module system to be used.',
    required: false,
    default: 'ESM',
  }),
  tsIncludeComments: Flags.boolean({
    description: 'TypeScript specific, if enabled add comments while generating models.',
    required: false,
    default: false,
  }),
  tsExportType: Flags.string({
    type: 'option',
    options: ['default', 'named'],
    description: 'TypeScript specific, define which type of export needs to be generated.',
    required: false,
    default: 'default',
  }),
  tsJsonBinPack: Flags.boolean({
    description: 'TypeScript specific, define basic support for serializing to and from binary with jsonbinpack.',
    required: false,
    default: false,
  }),
  tsMarshalling: Flags.boolean({
    description: 'TypeScript specific, generate the models with marshalling functions.',
    required: false,
    default: false,
  }),
  tsExampleInstance: Flags.boolean({
    description: 'Typescript specific, generate example of the model.',
    required: false,
    default: false,
  }),
}

/**
 * This function builds all the relevant information for the main generate command
 * 
 * @param flags 
 * @returns 
 */
export function buildTypeScriptGenerator(flags: any): BuilderReturnType {
  const { tsModelType, tsEnumType, tsIncludeComments, tsModuleSystem, tsExportType, tsJsonBinPack, tsMarshalling, tsExampleInstance } = flags;
  const presets = [];
  const options = {
    marshalling: tsMarshalling,
    example: tsExampleInstance,
  };
  presets.push({
    preset: TS_COMMON_PRESET,
    options
  });
  if (tsIncludeComments) { presets.push(TS_DESCRIPTION_PRESET); }
  if (tsJsonBinPack) {
    presets.push({
      preset: TS_COMMON_PRESET,
      options
    },
      TS_JSONBINPACK_PRESET);
  }

  const fileGenerator = new TypeScriptFileGenerator({
    modelType: tsModelType as 'class' | 'interface',
    enumType: tsEnumType as 'enum' | 'union',
    presets
  });
  const fileOptions = {
    moduleSystem: tsModuleSystem,
    exportType: tsExportType
  };
  return {
    fileOptions,
    fileGenerator
  }
}