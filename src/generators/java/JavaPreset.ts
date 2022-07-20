/* eslint-disable @typescript-eslint/ban-types */
import { Preset, ClassPreset, EnumPreset, PresetArgs, EnumArgs } from '../../models';
import { ClassRenderer, JAVA_DEFAULT_CLASS_PRESET } from './renderers/ClassRenderer';
import { EnumRenderer, JAVA_DEFAULT_ENUM_PRESET } from './renderers/EnumRenderer';

export interface JavaEnumPreset<O extends object = any> extends EnumPreset<EnumRenderer, O> {
  ctor?: (args: PresetArgs<EnumRenderer, O> & EnumArgs) => string;
  getValue?: (args: PresetArgs<EnumRenderer, O> & EnumArgs) => string;
  fromValue?: (args: PresetArgs<EnumRenderer, O> & EnumArgs) => string;
}

export type JavaPreset<O extends object = any> = Preset<{
  class: ClassPreset<ClassRenderer, O>;
  enum: JavaEnumPreset<O>;
}>;

export const JAVA_DEFAULT_PRESET: JavaPreset = {
  class: JAVA_DEFAULT_CLASS_PRESET,
  enum: JAVA_DEFAULT_ENUM_PRESET,
};
