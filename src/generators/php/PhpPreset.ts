/* eslint-disable @typescript-eslint/ban-types */
import { Preset, ClassPreset, EnumPreset } from '../../models';
import { PhpOptions } from './PhpGenerator';
import {
  ClassRenderer,
  PHP_DEFAULT_CLASS_PRESET
} from './renderers/ClassRenderer';
import {
  EnumRenderer,
  PHP_DEFAULT_ENUM_PRESET
} from './renderers/EnumRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;

export type PhpPreset<O = any> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
}>;

export const PHP_DEFAULT_PRESET: PhpPreset<PhpOptions> = {
  class: PHP_DEFAULT_CLASS_PRESET,
  enum: PHP_DEFAULT_ENUM_PRESET
};
