import { Preset, ClassPreset, EnumPreset } from '../../models';
import { ClassRenderer, DART_DEFAULT_CLASS_PRESET } from './renderers/ClassRenderer';
import { EnumRenderer, DART_DEFAULT_ENUM_PRESET } from './renderers/EnumRenderer';

export type DartPreset = Preset<{
  class: ClassPreset<ClassRenderer>;
  enum: EnumPreset<EnumRenderer>;
}>;

export const DART_DEFAULT_PRESET: DartPreset = {
  class: DART_DEFAULT_CLASS_PRESET,
  enum: DART_DEFAULT_ENUM_PRESET,
};
