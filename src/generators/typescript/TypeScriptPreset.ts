import {
  Preset,
  ClassPreset,
  InterfacePreset,
  EnumPreset,
  CommonPreset,
  ConstrainedMetaModel
} from '../../models';
import {
  ClassRenderer,
  TS_DEFAULT_CLASS_PRESET
} from './renderers/ClassRenderer';
import {
  InterfaceRenderer,
  TS_DEFAULT_INTERFACE_PRESET
} from './renderers/InterfaceRenderer';
import { EnumRenderer, TS_DEFAULT_ENUM_PRESET } from './renderers/EnumRenderer';
import { TypeRenderer, TS_DEFAULT_TYPE_PRESET } from './renderers/TypeRenderer';
import { TypeScriptOptions } from './TypeScriptGenerator';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export type InterfacePresetType<O> = InterfacePreset<InterfaceRenderer, O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;
export type TypePresetType<O> = CommonPreset<
  TypeRenderer,
  O,
  ConstrainedMetaModel
>;

export type TypeScriptPreset<O = any> = Preset<{
  class: ClassPresetType<O>;
  interface: InterfacePresetType<O>;
  enum: EnumPresetType<O>;
  type: TypePresetType<O>;
}>;

export const TS_DEFAULT_PRESET: TypeScriptPreset<TypeScriptOptions> = {
  class: TS_DEFAULT_CLASS_PRESET,
  interface: TS_DEFAULT_INTERFACE_PRESET,
  enum: TS_DEFAULT_ENUM_PRESET,
  type: TS_DEFAULT_TYPE_PRESET
};
