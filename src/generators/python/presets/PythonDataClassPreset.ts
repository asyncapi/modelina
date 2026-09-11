import { PythonPreset } from '../PythonPreset';

export const PYTHON_DATACLASS_PRESET: PythonPreset = {
  class: {
    async self({ renderer }) {
      return `from dataclasses import dataclass\n\n@dataclass\n${await renderer.defaultSelf()}`;
    }
  }
};
