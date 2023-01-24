import { AbstractRenderer } from '../AbstractRenderer';
import {
  Preset,
  CommonPreset,
  PresetArgs,
  EnumPreset,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel
} from '../../models';
import {
  StructRenderer,
  GO_DEFAULT_STRUCT_PRESET
} from './renderers/StructRenderer';
import { EnumRenderer, GO_DEFAULT_ENUM_PRESET } from './renderers/EnumRenderer';
import { GoOptions } from './GoGenerator';

export interface FieldArgs {
  field: ConstrainedObjectPropertyModel;
}

export interface StructPreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedObjectModel> {
  field?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & FieldArgs
  ) => Promise<string> | string;
}
export type StructPresetType<O> = StructPreset<StructRenderer, O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;

export type GoPreset<O = GoOptions> = Preset<{
  struct: StructPresetType<O>;
  enum: EnumPresetType<O>;
}>;

export const GO_DEFAULT_PRESET: GoPreset = {
  struct: GO_DEFAULT_STRUCT_PRESET,
  enum: GO_DEFAULT_ENUM_PRESET
};
