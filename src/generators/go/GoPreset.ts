/* eslint-disable @typescript-eslint/ban-types */
import { AbstractRenderer } from '../AbstractRenderer';
import { Preset, CommonModel, CommonPreset, PresetArgs } from '../../models';
import { StructRenderer, GO_DEFAULT_STRUCT_PRESET } from './renderers/StructRenderer';

export interface FieldArgs {
  fieldName: string;
  field: CommonModel;
}

export interface StructPreset<R extends AbstractRenderer, O extends object = any> extends CommonPreset<R, O> {
  ctor?: (args: PresetArgs<R, O>) => Promise<string> | string;
  field?: (args: PresetArgs<R, O> & FieldArgs) => Promise<string> | string;
  getter?: (args: PresetArgs<R, O> & FieldArgs) => Promise<string> | string;
  setter?: (args: PresetArgs<R, O> & FieldArgs) => Promise<string> | string;
}

export type GoPreset = Preset<{
  struct: StructPreset<StructRenderer>;
}>;

export const GO_DEFAULT_PRESET: GoPreset = {
  struct: GO_DEFAULT_STRUCT_PRESET,
};
