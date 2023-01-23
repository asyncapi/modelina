import { Preset, ClassPreset } from '../../models';
import {
  ClassRenderer,
  JS_DEFAULT_CLASS_PRESET
} from './renderers/ClassRenderer';

export type ClassPresetType<O> = ClassPreset<ClassRenderer, O>;

export type JavaScriptPreset<O = any> = Preset<{
  class: ClassPresetType<O>;
}>;

export const JS_DEFAULT_PRESET: JavaScriptPreset = {
  class: JS_DEFAULT_CLASS_PRESET
};
