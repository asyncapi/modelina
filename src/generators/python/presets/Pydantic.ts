import {
  ConstrainedDictionaryModel,
  ConstrainedUnionModel
} from '../../../models';
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
  property({ property, model, renderer }) {
    let type = property.property.type;
    const propertyName = property.propertyName;

    if (property.property instanceof ConstrainedUnionModel) {
      const unionTypes = property.property.union.map(
        (unionModel) => unionModel.type
      );
      type = `Union[${unionTypes.join(', ')}]`;
    }

    if (!property.required) {
      type = `Optional[${type}]`;
    }
    type = renderer.renderPropertyType({
      modelType: model.type,
      propertyType: type
    });

    const decoratorArgs: string[] = [];

    if (property.property.originalInput['description']) {
      decoratorArgs.push(
        `description='''${property.property.originalInput['description']}'''`
      );
    }
    if (
      property.property instanceof ConstrainedDictionaryModel &&
      property.property.serializationType === 'unwrap'
    ) {
      decoratorArgs.push('exclude=True');
    }
    if (!property.required) {
      decoratorArgs.push('default=None');
    }
    if (property.propertyName !== property.unconstrainedPropertyName) {
      decoratorArgs.push(`alias='''${property.unconstrainedPropertyName}'''`);
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
