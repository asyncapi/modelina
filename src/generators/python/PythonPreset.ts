/* eslint-disable @typescript-eslint/ban-types */
import { Preset, ClassPreset, EnumPreset } from '../../models';
import { PythonOptions } from './PythonGenerator';
import {
  ClassRenderer,
  PYTHON_DEFAULT_CLASS_PRESET
} from './renderers/ClassRenderer';
import {
  EnumRenderer,
  PYTHON_DEFAULT_ENUM_PRESET
} from './renderers/EnumRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;
export type EnumPresetType<O> = EnumPreset<EnumRenderer, O>;

export type PythonPreset<O = any> = Preset<{
  class: ClassPresetType<O>;
  enum: EnumPresetType<O>;
}>;

export const PYTHON_DEFAULT_PRESET: PythonPreset<PythonOptions> = {
  class: PYTHON_DEFAULT_CLASS_PRESET,
  enum: PYTHON_DEFAULT_ENUM_PRESET
};
