/* eslint-disable @typescript-eslint/ban-types */
import { Preset, ClassPreset, EnumPreset } from '../../models';
import { ScalaOptions } from './ScalaGenerator';
import {
  ClassRenderer,
  SCALA_DEFAULT_CLASS_PRESET
} from './renderers/ClassRenderer';
import {
  EnumRenderer,
  SCALA_DEFAULT_ENUM_PRESET
} from './renderers/EnumRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;

export type ScalaPreset<O = any> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
}>;

export const SCALA_DEFAULT_PRESET: ScalaPreset<ScalaOptions> = {
  class: SCALA_DEFAULT_CLASS_PRESET,
  enum: SCALA_DEFAULT_ENUM_PRESET
};
