/* eslint-disable @typescript-eslint/ban-types */
import { AbstractRenderer } from '../generators/AbstractRenderer';
import { InputMetaModel } from './InputMetaModel';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel
} from './ConstrainedMetaModel';

export interface PresetArgs<
  R extends AbstractRenderer,
  O,
  M extends ConstrainedMetaModel
> {
  model: M;
  inputModel: InputMetaModel;
  renderer: R;
  options: O;
  content: string;
}

export interface CommonPreset<
  R extends AbstractRenderer,
  O,
  M extends ConstrainedMetaModel
> {
  self?: (args: PresetArgs<R, O, M>) => Promise<string> | string;
  additionalContent?: (args: PresetArgs<R, O, M>) => Promise<string> | string;
}

export enum PropertyType {
  property,
  additionalProperty,
  patternProperties
}
export interface PropertyArgs {
  property: ConstrainedObjectPropertyModel;
}

export interface ClassPreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedObjectModel> {
  ctor?: (
    args: PresetArgs<R, O, ConstrainedObjectModel>
  ) => Promise<string> | string;
  property?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & PropertyArgs
  ) => Promise<string> | string;
  getter?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & PropertyArgs
  ) => Promise<string> | string;
  setter?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & PropertyArgs
  ) => Promise<string> | string;
}

export interface InterfacePreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedObjectModel> {
  property?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & PropertyArgs
  ) => Promise<string> | string;
}

export interface EnumArgs {
  item: ConstrainedEnumValueModel;
}

export interface EnumPreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedEnumModel> {
  item?: (args: PresetArgs<R, O, ConstrainedEnumModel> & EnumArgs) => string;
}

export interface ConstValuePreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedObjectModel> {
  item?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & PropertyArgs
  ) => string;
}

export type Preset<
  C extends Record<string, CommonPreset<any, any, any>> = any
> = Partial<C>;
export type PresetWithOptions<P extends Preset = Preset, O = any> = {
  preset: P;
  options: O;
};
export type Presets<P extends Preset = Preset> = Array<
  P | PresetWithOptions<P>
>;
