/* eslint-disable @typescript-eslint/ban-types */
import { Preset, ClassPreset, EnumPreset } from '../../models';
import { CppOptions } from './CppGenerator';
import { ClassRenderer, CPP_DEFAULT_CLASS_PRESET } from './renderers/ClassRenderer';
import { EnumRenderer, CPP_DEFAULT_ENUM_PRESET } from './renderers/EnumRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;

export type CppPreset<O = any> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
}>;

export const CPP_DEFAULT_PRESET: CppPreset<CppOptions> = {
  class: CPP_DEFAULT_CLASS_PRESET,
  enum: CPP_DEFAULT_ENUM_PRESET,
};
