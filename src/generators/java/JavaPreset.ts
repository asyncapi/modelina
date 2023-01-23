import {
  Preset,
  ClassPreset,
  EnumPreset,
  PresetArgs,
  EnumArgs,
  ConstrainedEnumModel
} from '../../models';
import { JavaOptions } from './JavaGenerator';
import {
  ClassRenderer,
  JAVA_DEFAULT_CLASS_PRESET
} from './renderers/ClassRenderer';
import {
  EnumRenderer,
  JAVA_DEFAULT_ENUM_PRESET
} from './renderers/EnumRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export interface EnumPresetType<O> extends EnumPreset<EnumRenderer, O> {
  ctor?: (
    args: PresetArgs<EnumRenderer, O, ConstrainedEnumModel> & EnumArgs
  ) => string;
  getValue?: (
    args: PresetArgs<EnumRenderer, O, ConstrainedEnumModel> & EnumArgs
  ) => string;
  fromValue?: (
    args: PresetArgs<EnumRenderer, O, ConstrainedEnumModel> & EnumArgs
  ) => string;
}

export type JavaPreset<O = any> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
}>;

export const JAVA_DEFAULT_PRESET: JavaPreset<JavaOptions> = {
  class: JAVA_DEFAULT_CLASS_PRESET,
  enum: JAVA_DEFAULT_ENUM_PRESET
};
