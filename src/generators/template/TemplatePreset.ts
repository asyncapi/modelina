/* eslint-disable @typescript-eslint/ban-types */
import { Preset, ClassPreset, EnumPreset } from '../../models';
import { TemplateOptions } from './TemplateGenerator';
import {
  ClassRenderer,
  TEMPLATE_DEFAULT_CLASS_PRESET
} from './renderers/ClassRenderer';
import {
  EnumRenderer,
  TEMPLATE_DEFAULT_ENUM_PRESET
} from './renderers/EnumRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;

export type TemplatePreset<O = any> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
}>;

export const TEMPLATE_DEFAULT_PRESET: TemplatePreset<TemplateOptions> = {
  class: TEMPLATE_DEFAULT_CLASS_PRESET,
  enum: TEMPLATE_DEFAULT_ENUM_PRESET
};
