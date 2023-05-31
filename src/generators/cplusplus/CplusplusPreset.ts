/* eslint-disable @typescript-eslint/ban-types */
import {
  Preset,
  EnumPreset,
  ConstrainedObjectModel,
  PropertyArgs,
  PresetArgs,
  CommonPreset
} from '../../models';
import { CplusplusOptions } from './CplusplusGenerator';
import {
  ClassRenderer,
  CPLUSPLUS_DEFAULT_CLASS_PRESET
} from './renderers/ClassRenderer';
import {
  EnumRenderer,
  CPLUSPLUS_DEFAULT_ENUM_PRESET
} from './renderers/EnumRenderer';

export interface CplusplusClassPreset<O>
  extends CommonPreset<ClassRenderer, O, ConstrainedObjectModel> {
  ctor?: (
    args: PresetArgs<ClassRenderer, O, ConstrainedObjectModel>
  ) => Promise<string> | string;
  property?: (
    args: PresetArgs<ClassRenderer, O, ConstrainedObjectModel> & PropertyArgs
  ) => Promise<string> | string;
}

export type ClassPresetType<O> = CplusplusClassPreset<O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;

export type CplusplusPreset<O = any> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
}>;

export const CPLUSPLUS_DEFAULT_PRESET: CplusplusPreset<CplusplusOptions> = {
  class: CPLUSPLUS_DEFAULT_CLASS_PRESET,
  enum: CPLUSPLUS_DEFAULT_ENUM_PRESET
};
