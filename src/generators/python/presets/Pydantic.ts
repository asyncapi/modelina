import {
  ConstrainedDictionaryModel,
  ConstrainedObjectPropertyModel,
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

    const isOptional =
      !property.required || property.property.options.isNullable === true;
    if (isOptional) {
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
    if (isOptional) {
      decoratorArgs.push('default=None');
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

    return `${propertyName}: ${type} = Field(${decoratorArgs.join(', ')})`;
  },
  ctor: () => '',
  getter: () => '',
  setter: () => '',
  additionalContent: ({ content, model, renderer }) => {
    const allProperties = Object.keys(model.properties);
    let dictionaryModel: ConstrainedObjectPropertyModel | undefined;
    for (const property of Object.values(model.properties)) {
      if (
        property.property instanceof ConstrainedDictionaryModel &&
        property.property.serializationType === 'unwrap'
      ) {
        dictionaryModel = property;
      }
    }
    const shouldHaveFunctions = dictionaryModel !== undefined;
    if (!shouldHaveFunctions) {
      return content;
    }

    renderer.dependencyManager.addDependency(
      'from pydantic import model_serializer, model_validator'
    );
    // eslint-disable-next-line prettier/prettier
    return `@model_serializer(mode='wrap')
def custom_serializer(self, handler):
  serialized_self = handler(self)
  ${dictionaryModel?.propertyName} = getattr(self, "${dictionaryModel?.propertyName}")
  if ${dictionaryModel?.propertyName} is not None:
    for key, value in ${dictionaryModel?.propertyName}.items():
      # Never overwrite existing values, to avoid clashes
      if not hasattr(serialized_self, key):
        serialized_self[key] = value

  return serialized_self

@model_validator(mode='before')
@classmethod
def unwrap_${dictionaryModel?.propertyName}(cls, data):
  if not isinstance(data, dict):
    data = data.model_dump()
  json_properties = list(data.keys())
  known_object_properties = [${allProperties
    .map((value) => `'${value}'`)
    .join(', ')}]
  unknown_object_properties = [element for element in json_properties if element not in known_object_properties]
  # Ignore attempts that validate regular models, only when unknown input is used we add unwrap extensions
  if len(unknown_object_properties) == 0: 
    return data
  
  known_json_properties = [${Object.values(model.properties)
    .map((value) => `'${value.unconstrainedPropertyName}'`)
    .join(', ')}]
  ${dictionaryModel?.propertyName} = data.get('${dictionaryModel?.propertyName}', {})
  for obj_key in list(data.keys()):
    if not known_json_properties.__contains__(obj_key):
      ${dictionaryModel?.propertyName}[obj_key] = data.pop(obj_key, None)
  data['${dictionaryModel?.propertyName}'] = ${dictionaryModel?.propertyName}
  return data
${content}`;
  }
};

export const PYTHON_PYDANTIC_PRESET: PythonPreset<PythonOptions> = {
  class: PYTHON_PYDANTIC_CLASS_PRESET
};
