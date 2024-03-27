import { AbstractRenderer } from '../AbstractRenderer';
import {
  Preset,
  CommonPreset,
  PresetArgs,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedEnumModel,
  EnumArgs,
  ConstrainedUnionModel,
  ConstrainedMetaModel
} from '../../models';
import {
  StructRenderer,
  GO_DEFAULT_STRUCT_PRESET
} from './renderers/StructRenderer';
import { EnumRenderer, GO_DEFAULT_ENUM_PRESET } from './renderers/EnumRenderer';
import {
  GO_DEFAULT_UNION_PRESET,
  UnionRenderer
} from './renderers/UnionRenderer';
import { GoOptions } from './GoGenerator';

export interface FieldArgs {
  field: ConstrainedObjectPropertyModel;
}

export interface UnionFieldArgs {
  field: ConstrainedMetaModel;
}

export interface StructPreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedObjectModel> {
  field?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & FieldArgs
  ) => Promise<string> | string;
}

export interface UnionPreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedUnionModel> {
  field?: (
    args: PresetArgs<R, O, ConstrainedUnionModel> & UnionFieldArgs
  ) => Promise<string> | string;
}
interface EnumPreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedEnumModel> {
  item?: (
    args: PresetArgs<R, O, ConstrainedEnumModel> & EnumArgs & { index: number }
  ) => string;
}
export type StructPresetType<O> = StructPreset<StructRenderer, O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;
export type UnionPresetType<O> = UnionPreset<UnionRenderer, O>;

export type GoPreset<O = any> = Preset<{
  struct: StructPresetType<O>;
  enum: EnumPresetType<O>;
  union: UnionPresetType<O>;
}>;

export const GO_DEFAULT_PRESET: GoPreset<GoOptions> = {
  struct: GO_DEFAULT_STRUCT_PRESET,
  enum: GO_DEFAULT_ENUM_PRESET,
  union: GO_DEFAULT_UNION_PRESET
};
