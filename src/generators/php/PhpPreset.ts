/* eslint-disable @typescript-eslint/ban-types */
import { Preset, ClassPreset, EnumPreset } from '../../models';
import { PhpOptions } from './PhpGenerator';
import { ClassRenderer, Php_DEFAULT_CLASS_PRESET } from './renderers/ClassRenderer';
import { EnumRenderer, Php_DEFAULT_ENUM_PRESET } from './renderers/EnumRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;

export type PhpPreset<O = any> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
}>;

export const Php_DEFAULT_PRESET: PhpPreset<PhpOptions> = {
  class: Php_DEFAULT_CLASS_PRESET,
  enum: Php_DEFAULT_ENUM_PRESET,
};
