/* eslint-disable @typescript-eslint/ban-types */
import { AbstractRenderer } from '../generators/AbstractRenderer';
import { InputMetaModel } from './InputMetaModel';
import { CommonModel } from './CommonModel';
import { ConstrainedEnumModel, ConstrainedEnumValueModel, ConstrainedMetaModel, ConstrainedObjectModel } from './ConstrainedMetaModel';

export interface PresetArgs<PresetRenderer extends AbstractRenderer, PresetOptions extends object = any, ModelType extends ConstrainedMetaModel = ConstrainedMetaModel,> {
  model: ModelType;
  inputModel: InputMetaModel;
  renderer: PresetRenderer;
  options: PresetOptions;
  content: string;
}

export interface CommonPreset<PresetRenderer extends AbstractRenderer, PresetOptions extends object = any, ModelType extends ConstrainedMetaModel = ConstrainedMetaModel> {
  self?: (args: PresetArgs<PresetRenderer, PresetOptions, ModelType>) => Promise<string> | string;
  additionalContent?: (args: PresetArgs<PresetRenderer, PresetOptions, ModelType>) => Promise<string> | string;
}

export interface PropertyArgs {
  propertyName: string;
  property: ConstrainedMetaModel;
}

export interface ClassPreset<PresetRenderer extends AbstractRenderer, PresetOptions extends object = any> extends CommonPreset<PresetRenderer, PresetOptions, ConstrainedObjectModel> {
  ctor?: (args: PresetArgs<PresetRenderer, PresetOptions, ConstrainedObjectModel>) => Promise<string> | string;
  property?: (args: PresetArgs<PresetRenderer, PresetOptions, ConstrainedObjectModel> & PropertyArgs) => Promise<string> | string;
  getter?: (args: PresetArgs<PresetRenderer, PresetOptions, ConstrainedObjectModel> & PropertyArgs) => Promise<string> | string;
  setter?: (args: PresetArgs<PresetRenderer, PresetOptions, ConstrainedObjectModel> & PropertyArgs) => Promise<string> | string;
}

export interface InterfacePreset<PresetRenderer extends AbstractRenderer, PresetOptions extends object = any> extends CommonPreset<PresetRenderer, PresetOptions, ConstrainedObjectModel> {
  property?: (args: PresetArgs<PresetRenderer, PresetOptions, ConstrainedObjectModel> & PropertyArgs) => Promise<string> | string;
}

export interface EnumArgs {
  item: ConstrainedEnumValueModel;
}

export interface EnumPreset<PresetRenderer extends AbstractRenderer, PresetOptions extends object = any> extends CommonPreset<PresetRenderer, PresetOptions, ConstrainedObjectModel> {
  item?: (args: PresetArgs<PresetRenderer, PresetOptions, ConstrainedEnumModel> & EnumArgs) => string;
}

export type Preset<C extends Record<string, CommonPreset<any, any>> = any> = Partial<C>;
export type PresetWithOptions<P extends Preset = Preset, PresetOptions = any> = {
  preset: P,
  options: PresetOptions,
}
export type Presets<P extends Preset = Preset> = Array<P | PresetWithOptions<P>>;
