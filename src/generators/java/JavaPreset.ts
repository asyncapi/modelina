/* eslint-disable @typescript-eslint/ban-types */
import { Preset, ClassPreset, EnumPreset } from '../../models';
import { JavaOptions } from './JavaGenerator';
import { ClassRenderer, JAVA_DEFAULT_CLASS_PRESET } from './renderers/ClassRenderer';
import { EnumRenderer, JAVA_DEFAULT_ENUM_PRESET } from './renderers/EnumRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;

export type JavaPreset<O = JavaOptions> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
}>;

export const JAVA_DEFAULT_PRESET: JavaPreset = {
  class: JAVA_DEFAULT_CLASS_PRESET,
  enum: JAVA_DEFAULT_ENUM_PRESET,
};
