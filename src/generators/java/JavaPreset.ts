import { Preset, ClassPreset, EnumPreset } from '../../models';
import { ClassRenderer, JAVA_DEFAULT_CLASS_PRESET } from './renderers/ClassRenderer';
import { EnumRenderer, JAVA_DEFAULT_ENUM_PRESET } from './renderers/EnumRenderer';

export type JavaPreset = Preset<{
  class: ClassPreset<ClassRenderer>;
  enum: EnumPreset<EnumRenderer>;
}>;

export const JAVA_DEFAULT_PRESET: JavaPreset = {
  class: JAVA_DEFAULT_CLASS_PRESET,
  enum: JAVA_DEFAULT_ENUM_PRESET,
};
