import { Preset, ClassPreset, EnumPreset } from '../../models';
import { JavaOptions } from './JavaGenerator';
import { ClassRenderer, JAVA_DEFAULT_CLASS_PRESET } from './renderers/ClassRenderer';
import { EnumRenderer, JAVA_DEFAULT_ENUM_PRESET } from './renderers/EnumRenderer';
import { JAVA_DEFAULT_UNION_PRESET, UnionRenderer } from './renderers/UnionRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;
export type UnionPresetType<O> = ClassPreset<UnionRenderer, O>;

export type JavaPreset<O = any> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
  union: UnionPresetType<O>;
}>;

export const JAVA_DEFAULT_PRESET: JavaPreset<JavaOptions> = {
  class: JAVA_DEFAULT_CLASS_PRESET,
  enum: JAVA_DEFAULT_ENUM_PRESET,
  union: JAVA_DEFAULT_UNION_PRESET,
};
