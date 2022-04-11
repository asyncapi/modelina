/* eslint-disable @typescript-eslint/ban-types */
import { Preset, ClassPreset } from '../../models';

import { ClassRenderer, JS_DEFAULT_CLASS_PRESET } from './renderers/ClassRenderer';

export type JavaScriptPreset<O extends object = any> = Preset<{
  class: ClassPreset<ClassRenderer, O>;
}>;

export const JS_DEFAULT_PRESET: JavaScriptPreset = {
  class: JS_DEFAULT_CLASS_PRESET,
};
