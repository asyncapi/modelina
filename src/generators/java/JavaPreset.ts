import { AbstractRenderer } from '../../generators/AbstractRenderer';
import {
  Preset,
  ClassPreset,
  EnumPreset,
  PresetArgs,
  EnumArgs,
  ConstrainedEnumModel,
  CommonPreset,
  ConstrainedUnionModel
} from '../../models';
import { JavaOptions } from './JavaGenerator';
import {
  ClassRenderer,
  JAVA_DEFAULT_CLASS_PRESET
} from './renderers/ClassRenderer';
import {
  EnumRenderer,
  JAVA_DEFAULT_ENUM_PRESET
} from './renderers/EnumRenderer';
import {
  JAVA_DEFAULT_UNION_PRESET,
  UnionRenderer
} from './renderers/UnionRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export interface EnumPresetType<O> extends EnumPreset<EnumRenderer, O> {
  ctor?: (
    args: PresetArgs<EnumRenderer, O, ConstrainedEnumModel> & EnumArgs
  ) => string;
  getValue?: (
    args: PresetArgs<EnumRenderer, O, ConstrainedEnumModel> & EnumArgs
  ) => string;
  fromValue?: (
    args: PresetArgs<EnumRenderer, O, ConstrainedEnumModel> & EnumArgs
  ) => string;
}

export type UnionPresetType<O> = UnionPreset<UnionRenderer, O>;

export interface UnionPreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedUnionModel> {
  discriminatorGetter?: (
    args: PresetArgs<R, O, ConstrainedUnionModel>
  ) => string;
}

export type JavaPreset<O = any> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
  union: UnionPresetType<O>;
}>;

export const JAVA_DEFAULT_PRESET: JavaPreset<JavaOptions> = {
  class: JAVA_DEFAULT_CLASS_PRESET,
  enum: JAVA_DEFAULT_ENUM_PRESET,
  union: JAVA_DEFAULT_UNION_PRESET
};
