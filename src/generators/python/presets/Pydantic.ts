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

    const description = property.property.originalInput['description']
      ? `description='''${property.property.originalInput['description']}'''`
      : undefined;
    const defaultValue = property.required ? undefined : 'default=None';
    const jsonAlias = `serialization_alias='${property.unconstrainedPropertyName}'`;
    let exclude = undefined;
    if (
      property.property instanceof ConstrainedDictionaryModel &&
      property.property.serializationType === 'unwrap'
    ) {
      exclude = 'exclude=True';
    }
    const fieldTags = [description, defaultValue, jsonAlias, exclude].filter(
      (value) => value
    );
    return `${propertyName}: ${type} = Field(${fieldTags.join(', ')})`;
  },
  ctor: () => '',
  getter: () => '',
  setter: () => ''
};

export const PYTHON_PYDANTIC_PRESET: PythonPreset<PythonOptions> = {
  class: PYTHON_PYDANTIC_CLASS_PRESET
};
