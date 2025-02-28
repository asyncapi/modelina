import { PythonPreset } from '../PythonPreset';

export const PYTHON_DATACLASS_PRESET: PythonPreset = {
  class: {
    self({ renderer }) {
      return `from dataclasses import dataclass\n\n@dataclass\n${renderer.defaultSelf()}`;
    }
  }
};
