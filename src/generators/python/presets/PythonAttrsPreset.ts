import { PythonPreset } from '../PythonPreset';

export const PYTHON_ATTRS_PRESET: PythonPreset = {
  class: {
    async self({ renderer }) {
      return `import attr\n\n@attr.s(auto_attribs=True)\n${await renderer.defaultSelf()}`;
    }
  }
};
