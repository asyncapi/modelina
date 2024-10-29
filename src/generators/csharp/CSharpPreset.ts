import {
  Preset,
  EnumPreset,
  ClassPreset,
  PresetArgs,
  PropertyArgs,
  ConstrainedObjectModel,
  InterfacePreset,
  ConstrainedEnumModel
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
} from './renderers/RecordRenderer';

// Our class preset uses custom `accessor` hook to craft getter and setters.
export interface CsharpClassPreset<O> extends ClassPreset<ClassRenderer, O> {
  accessor?: (
    args: PresetArgs<ClassRenderer, O, ConstrainedObjectModel> & PropertyArgs
  ) => Promise<string> | string;
}

export interface CsharpRecordPreset<O>
  extends InterfacePreset<RecordRenderer, O> {
  getter?: (
    args: PresetArgs<RecordRenderer, O, ConstrainedObjectModel> & PropertyArgs
  ) => Promise<string> | string;
  setter?: (
    args: PresetArgs<RecordRenderer, O, ConstrainedObjectModel> & PropertyArgs
  ) => Promise<string> | string;
}

export type ClassPresetType<O> = CsharpClassPreset<O>;
export type RecordPresetType<O> = CsharpRecordPreset<O>;
export interface EnumPresetType<O> extends EnumPreset<EnumRenderer, O> {
  extension?: (
    args: PresetArgs<EnumRenderer, O, ConstrainedEnumModel>
  ) => Promise<string> | string;
  extensionMethods?: (
    args: PresetArgs<EnumRenderer, O, ConstrainedEnumModel>
  ) => Promise<string> | string;
};
export type CSharpPreset<O = any> = Preset<{
  class: CsharpClassPreset<O>;
  record: CsharpRecordPreset<O>;
  enum: EnumPresetType<O>;
}>;

export const CSHARP_DEFAULT_PRESET: CSharpPreset<CSharpOptions> = {
  class: CSHARP_DEFAULT_CLASS_PRESET,
  record: CSHARP_DEFAULT_RECORD_PRESET,
  enum: CSHARP_DEFAULT_ENUM_PRESET
};
