import { Preset, EnumPreset, ClassPreset, PresetArgs, PropertyArgs } from '../../models';
import { ClassRenderer, CSHARP_DEFAULT_CLASS_PRESET } from './renderers/ClassRenderer';
import { CSHARP_DEFAULT_ENUM_PRESET, EnumRenderer } from './renderers/EnumRenderer';

// Our class preset uses custom `accessor` hook to craft getter and setters.
export interface CsharpClassPreset extends ClassPreset<ClassRenderer> {
  accessor?: (args: PresetArgs<ClassRenderer, any> & PropertyArgs) => Promise<string> | string;
}

export type CSharpPreset = Preset<{
  class: CsharpClassPreset;
  enum: EnumPreset<EnumRenderer>
}>;

export const CSHARP_DEFAULT_PRESET: CSharpPreset = {
  class: CSHARP_DEFAULT_CLASS_PRESET,
  enum: CSHARP_DEFAULT_ENUM_PRESET,
};
