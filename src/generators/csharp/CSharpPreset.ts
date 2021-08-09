/* eslint-disable @typescript-eslint/ban-types */
import { Preset, EnumPreset, ClassPreset } from '../../models';
import { ClassRenderer, CSHARP_DEFAULT_CLASS_PRESET } from './renderers/ClassRenderer';
import { CSHARP_DEFAULT_ENUM_PRESET, EnumRenderer } from './renderers/EnumRenderer';

export type CSharpPreset = Preset<{
  class: ClassPreset<ClassRenderer>;
  enum: EnumPreset<EnumRenderer>
}>;

export const CSHARP_DEFAULT_PRESET: CSharpPreset = {
  class: CSHARP_DEFAULT_CLASS_PRESET,
  enum: CSHARP_DEFAULT_ENUM_PRESET,
};
