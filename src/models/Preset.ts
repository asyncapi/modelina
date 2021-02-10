import { AbstractRenderer } from "../generators/AbstractRenderer";
import { CommonInputModel } from "./CommonInputModel";
import { CommonModel } from "./CommonModel";

// TODO: Change any type to correct one
export type Preset<C extends Record<string, any> = any> = Partial<C>;
export type PresetWithOptions<P extends Preset = Preset> = {
  preset: P,
  options: any,
}
export type Presets<P extends Preset = Preset> = Array<P | PresetWithOptions<P>>;

export function isPresetWithOptions(preset: Preset | PresetWithOptions): preset is PresetWithOptions {
  return preset.hasOwnProperty('preset');
}

export interface CommonPreset<R extends AbstractRenderer> {
  self?: (args: PresetArgs<R>) => string;
}

export interface PresetArgs<R extends AbstractRenderer> {
  model: CommonModel;
  inputModel: CommonInputModel;
  renderer: R;
  content: string;
}

export interface PropertyArgs {
  propertyName: string;
  property: CommonModel;
}

export interface ClassPreset<R extends AbstractRenderer> extends CommonPreset<R> {
  ctor?: (args: PresetArgs<R>) => string;
  property?: (args: PresetArgs<R> & PropertyArgs) => string;
  getter?: (args: PresetArgs<R> & PropertyArgs) => string;
  setter?: (args: PresetArgs<R> & PropertyArgs) => string;
}

export interface InterfacePreset<R extends AbstractRenderer> extends CommonPreset<R> {
  property?: (args: PresetArgs<R> & PropertyArgs) => string;
}

export interface EnumArgs {
  value: any;
}

export interface EnumPreset<R extends AbstractRenderer> extends CommonPreset<R> {
  item?: (args: PresetArgs<R> & EnumArgs) => string;
}
