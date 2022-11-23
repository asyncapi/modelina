import { CommonCompleteOptions, CommonFileOptions, CommonOptions, defaultCommonCompleteOptions, defaultCommonFileOptions, defaultOptions } from "../CommonGeneratorOptions";
import { Constraints, TypeMapping } from "../../helpers";
import { TS_DEFAULT_PRESET, TypeScriptPreset } from "./TypeScriptPreset";
import { TypeScriptDefaultConstraints, TypeScriptDefaultTypeMapping } from "./TypeScriptConstrainer";

export interface TypeScriptOptions extends CommonOptions<TypeScriptPreset> {
  renderTypes: boolean;
  modelType: 'class' | 'interface';
  enumType: 'enum' | 'union';
  mapType: 'indexedObject' | 'map' | 'record';
  typeMapping: TypeMapping<TypeScriptOptions>;
  constraints: Constraints;
  moduleSystem: 'ESM' | 'CJS';
}

export const defaultTypeScriptOptions: TypeScriptOptions = {
  ...defaultOptions,
  renderTypes: true,
  modelType: 'class',
  enumType: 'enum',
  mapType: 'map',
  defaultPreset: TS_DEFAULT_PRESET,
  typeMapping: TypeScriptDefaultTypeMapping,
  constraints: TypeScriptDefaultConstraints,
  moduleSystem: 'ESM'
};


type TypeScriptCompleteOptionsUnion = CommonCompleteOptions & TypeScriptOptions;
export interface TypeScriptCompleteOptions extends TypeScriptCompleteOptionsUnion  {
  exportType: 'default' | 'named';
}

export const defaultTypeScriptCompleteOptions: TypeScriptCompleteOptions = {
  ...defaultCommonCompleteOptions,
  ...defaultTypeScriptOptions,
  exportType: 'default'
}

type TypeScriptFileOptionUnion = TypeScriptCompleteOptionsUnion & CommonFileOptions;
export interface TypeScriptFileOptions extends TypeScriptFileOptionUnion  {}

export const defaultTypeScriptFileOptions: TypeScriptFileOptions = {
  ...defaultTypeScriptCompleteOptions,
  ...defaultCommonFileOptions
}

