import {
  Preset,
  EnumPreset,
  ClassPreset,
  PresetArgs,
  PropertyArgs,
  ConstrainedObjectModel
} from '../../models';
import { CSharpOptions } from './CSharpGenerator';
import {
  ClassRenderer,
  CSHARP_DEFAULT_CLASS_PRESET
} from './renderers/ClassRenderer';
import {
  CSHARP_DEFAULT_ENUM_PRESET,
  EnumRenderer
} from './renderers/EnumRenderer';
import {
  RecordRenderer, 
  CSHARP_DEFAULT_RECORD_PRESET
} from "./renderers/RecordRenderer";

// Our class preset uses custom `accessor` hook to craft getter and setters.
export interface CsharpClassPreset<O> extends ClassPreset<ClassRenderer, O> {
  accessor?: (
    args: PresetArgs<ClassRenderer, O, ConstrainedObjectModel> & PropertyArgs
  ) => Promise<string> | string;
}

export interface CsharpRecordPreset<O> extends ClassPreset<RecordRenderer, O> {
}

export type ClassPresetType<O> = CsharpClassPreset<O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;

export type CSharpPreset<O = any> = Preset<{
  class: CsharpClassPreset<O>;
  record: CsharpRecordPreset<0>;
  enum: EnumPreset<EnumRenderer, O>;
}>;

export const CSHARP_DEFAULT_PRESET: CSharpPreset<CSharpOptions> = {
  class: CSHARP_DEFAULT_CLASS_PRESET,
  record: CSHARP_DEFAULT_RECORD_PRESET,
  enum: CSHARP_DEFAULT_ENUM_PRESET
};
