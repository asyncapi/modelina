/* eslint-disable @typescript-eslint/ban-types */
import {
  Preset,
  ClassPreset,
  EnumPreset,
  PresetArgs,
  ConstrainedEnumModel,
  ConstrainedUnionModel,
  CommonPreset
} from '../../models';
import { KotlinOptions } from './KotlinGenerator';
import {
  ClassRenderer,
  KOTLIN_DEFAULT_CLASS_PRESET
} from './renderers/ClassRenderer';
import {
  EnumRenderer,
  KOTLIN_DEFAULT_ENUM_PRESET
} from './renderers/EnumRenderer';
import {
  UnionRenderer,
  KOTLIN_DEFAULT_UNION_PRESET
} from './renderers/UnionRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export interface EnumPresetType<O> extends EnumPreset<EnumRenderer, O> {
  value?: (
    args: PresetArgs<EnumRenderer, O, ConstrainedEnumModel>
  ) => Promise<string> | string;
  fromValue?: (
    args: PresetArgs<EnumRenderer, O, ConstrainedEnumModel>
  ) => Promise<string> | string;
}

export type UnionPresetType<O> = CommonPreset<
  UnionRenderer,
  O,
  ConstrainedUnionModel
>;

export type KotlinPreset<O = any> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
  union: UnionPresetType<O>;
}>;

export const KOTLIN_DEFAULT_PRESET: KotlinPreset<KotlinOptions> = {
  class: KOTLIN_DEFAULT_CLASS_PRESET,
  enum: KOTLIN_DEFAULT_ENUM_PRESET,
  union: KOTLIN_DEFAULT_UNION_PRESET
};
