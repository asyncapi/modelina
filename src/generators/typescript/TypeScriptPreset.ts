import { Preset, ClassPreset, InterfacePreset, EnumPreset, CommonPreset } from '../../models';

import { ClassRenderer, TS_DEFAULT_CLASS_PRESET } from './renderers/ClassRenderer';
import { InterfaceRenderer, TS_DEFAULT_INTERFACE_PRESET } from './renderers/InterfaceRenderer';
import { EnumRenderer, TS_DEFAULT_ENUM_PRESET } from './renderers/EnumRenderer';
import { TypeRenderer, TS_DEFAULT_TYPE_PRESET } from './renderers/TypeRenderer';

export type TypePreset<R extends TypeRenderer = TypeRenderer> = CommonPreset<R>

export type TypeScriptPreset = Preset<{
  class: ClassPreset<ClassRenderer>;
  interface: InterfacePreset<InterfaceRenderer>;
  enum: EnumPreset<EnumRenderer>;
  type: TypePreset;
}>;

export const TS_DEFAULT_PRESET: TypeScriptPreset = {
  class: TS_DEFAULT_CLASS_PRESET,
  interface: TS_DEFAULT_INTERFACE_PRESET,
  enum: TS_DEFAULT_ENUM_PRESET,
  type: TS_DEFAULT_TYPE_PRESET,
};
