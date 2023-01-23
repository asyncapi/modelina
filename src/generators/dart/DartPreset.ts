import { Preset, ClassPreset, EnumPreset } from '../../models';
import { DartOptions } from './DartGenerator';
import {
  ClassRenderer,
  DART_DEFAULT_CLASS_PRESET
} from './renderers/ClassRenderer';
import {
  EnumRenderer,
  DART_DEFAULT_ENUM_PRESET
} from './renderers/EnumRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;

export type DartPreset<O = DartOptions> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
}>;

export const DART_DEFAULT_PRESET: DartPreset = {
  class: DART_DEFAULT_CLASS_PRESET,
  enum: DART_DEFAULT_ENUM_PRESET
};
