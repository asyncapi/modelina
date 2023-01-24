/* eslint-disable @typescript-eslint/ban-types */
import { Preset, ClassPreset, EnumPreset } from '../../models';
import { KotlinOptions } from './KotlinGenerator';
import {
  ClassRenderer,
  KOTLIN_DEFAULT_CLASS_PRESET
} from './renderers/ClassRenderer';
import {
  EnumRenderer,
  KOTLIN_DEFAULT_ENUM_PRESET
} from './renderers/EnumRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;

export type KotlinPreset<O = any> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
}>;

export const KOTLIN_DEFAULT_PRESET: KotlinPreset<KotlinOptions> = {
  class: KOTLIN_DEFAULT_CLASS_PRESET,
  enum: KOTLIN_DEFAULT_ENUM_PRESET
};
