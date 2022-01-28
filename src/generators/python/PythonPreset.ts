import { Preset, ClassPreset } from '../../models';

import { ClassRenderer, PYTHON_DEFAULT_CLASS_PRESET } from './renderers/ClassRenderer';

export type PythonPreset = Preset<{
  class: ClassPreset<ClassRenderer>;
}>;

export const PYTHON_DEFAULT_PRESET: PythonPreset = {
  class: PYTHON_DEFAULT_CLASS_PRESET,
};
