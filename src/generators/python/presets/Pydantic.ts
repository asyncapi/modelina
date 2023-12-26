import { PythonOptions } from '../PythonGenerator';
import { ClassPresetType, PythonPreset } from '../PythonPreset';

const PYTHON_PYDANTIC_CLASS_PRESET: ClassPresetType<PythonOptions> = {
  async self({ renderer, model }) {
    renderer.dependencyManager.addDependency(
      'from typing import Optional, Any'
    );
    renderer.dependencyManager.addDependency(
      'from pydantic import BaseModel, Field'
    );

    const defaultClassString = await renderer.defaultSelf();

    return defaultClassString.replace(
      `class ${model.name}:`,
      `class ${model.name}(BaseModel):`
    );
  },
  property(params) {
    const { propertyName, required, property } = params.property;
    const type = required ? property.type : `Optional[${property.type}]`;
    const description = property.originalInput['description'];
    const alias = description ? `alias='''${description}'''` : '';
    const defaultValue = required ? '' : 'default=None';

    if (alias && defaultValue) {
      return `${propertyName}: ${type} = Field(${alias}, ${defaultValue})`;
    } else if (alias) {
      return `${propertyName}: ${type} = Field(${alias})`;
    }
    return `${propertyName}: ${type} = Field(${defaultValue})`;
  },
  ctor: () => '',
  getter: () => '',
  setter: () => ''
};

export const PYTHON_PYDANTIC_PRESET: PythonPreset<PythonOptions> = {
  class: PYTHON_PYDANTIC_CLASS_PRESET
};
