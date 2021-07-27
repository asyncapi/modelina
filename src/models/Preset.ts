/* eslint-disable @typescript-eslint/ban-types */
import { AbstractRenderer } from '../generators/AbstractRenderer';
import { CommonInputModel } from './CommonInputModel';
import { CommonModel } from './CommonModel';

export interface PresetArgs<R extends AbstractRenderer, O extends object = any> {
  model: CommonModel;
  inputModel: CommonInputModel;
  renderer: R;
  options: O;
  content: string;
}

export interface CommonPreset<R extends AbstractRenderer, O extends object = any> {
  self?: (args: PresetArgs<R, O>) => Promise<string> | string;
  additionalContent?: (args: PresetArgs<R, O>) => Promise<string> | string;
}

export enum PropertyType {
  property,
  additionalProperty,
  patternProperties
}
export interface PropertyArgs {
  propertyName: string;
  property: CommonModel;
  type: PropertyType;
}

export interface ClassPreset<R extends AbstractRenderer, O extends object = any> extends CommonPreset<R, O> {
  ctor?: (args: PresetArgs<R, O>) => Promise<string> | string;
  property?: (args: PresetArgs<R, O> & PropertyArgs) => Promise<string> | string;
  getter?: (args: PresetArgs<R, O> & PropertyArgs) => Promise<string> | string;
  setter?: (args: PresetArgs<R, O> & PropertyArgs) => Promise<string> | string;
}

export interface InterfacePreset<R extends AbstractRenderer, O extends object = any> extends CommonPreset<R, O> {
  property?: (args: PresetArgs<R, O> & PropertyArgs) => Promise<string> | string;
}

export interface EnumArgs {
  item: any;
}

export interface EnumPreset<R extends AbstractRenderer, O extends object = any> extends CommonPreset<R, O> {
  item?: (args: PresetArgs<R, O> & EnumArgs) => string;
}

export type Preset<C extends Record<string, CommonPreset<any, any>> = any> = Partial<C>;
export type PresetWithOptions<P extends Preset = Preset, O = any> = {
  preset: P,
  options: O,
}
export type Presets<P extends Preset = Preset> = Array<P | PresetWithOptions<P>>;
