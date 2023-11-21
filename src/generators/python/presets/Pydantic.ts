import { ConstrainedUnionModel } from '../../../models';
import { PythonOptions } from '../PythonGenerator';
import { ClassPresetType, PythonPreset } from '../PythonPreset';

const PYTHON_PYDANTIC_CLASS_PRESET: ClassPresetType<PythonOptions> = {
  async self({ renderer, model }) {
    renderer.dependencyManager.addDependency(
      'from typing import Optional, Any, Union'
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
    let type = params.property.property.type;

    if (params.property.property instanceof ConstrainedUnionModel) {
      const unionTypes = params.property.property.union.map(
        (unionModel) => unionModel.type
      );
      type = `Union[${unionTypes.join(', ')}]`;
    }

    if (!params.property.required) {
      type = `Optional[${type}]`;
    }

    const alias = params.property.property.originalInput['description']
      ? `alias='''${params.property.property.originalInput['description']}'''`
      : '';

    return `${params.property.propertyName}: ${type} = Field(${alias})`;
  },
  ctor: () => '',
  getter: () => '',
  setter: () => ''
};

export const PYTHON_PYDANTIC_PRESET: PythonPreset<PythonOptions> = {
  class: PYTHON_PYDANTIC_CLASS_PRESET
};
