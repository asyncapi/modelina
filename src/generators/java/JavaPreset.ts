/* eslint-disable @typescript-eslint/ban-types */
import { Preset, ClassPreset, EnumPreset } from '../../models';
import { ClassRenderer, JAVA_DEFAULT_CLASS_PRESET } from './renderers/ClassRenderer';
import { EnumRenderer, JAVA_DEFAULT_ENUM_PRESET } from './renderers/EnumRenderer';

export type JavaPreset<O extends object = any> = Preset<{
  class: ClassPreset<ClassRenderer, O>;
  enum: EnumPreset<EnumRenderer, O>;
}>;

export const JAVA_DEFAULT_PRESET: JavaPreset = {
  class: JAVA_DEFAULT_CLASS_PRESET,
  enum: JAVA_DEFAULT_ENUM_PRESET,
};
