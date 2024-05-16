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
    const propertyName = params.property.propertyName;

    if (params.property.property instanceof ConstrainedUnionModel) {
      const unionTypes = params.property.property.union.map(
        (unionModel) => unionModel.type
      );
      type = `Union[${unionTypes.join(', ')}]`;
    }

    const isOptional =
      !params.property.required ||
      params.property.property.options.isNullable === true;
    if (isOptional) {
      type = `Optional[${type}]`;
    }

    const decoratorArgs: string[] = [];

    if (params.property.property.originalInput['description']) {
      decoratorArgs.push(
        `description='''${params.property.property.originalInput['description']}'''`
      );
    }
    if (isOptional) {
      decoratorArgs.push('default=None');
    }
    if (
      params.property.propertyName !== params.property.unconstrainedPropertyName
    ) {
      decoratorArgs.push(
        `alias='''${params.property.unconstrainedPropertyName}'''`
      );
    }

    return `${propertyName}: ${type} = Field(${decoratorArgs.join(', ')})`;
  },
  ctor: () => '',
  getter: () => '',
  setter: () => ''
};

export const PYTHON_PYDANTIC_PRESET: PythonPreset<PythonOptions> = {
  class: PYTHON_PYDANTIC_CLASS_PRESET
};
