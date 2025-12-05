import {
  ConstrainedDictionaryModel,
  ConstrainedObjectPropertyModel
} from '../../../models';
import { PythonOptions } from '../PythonGenerator';
import { ClassPresetType, PythonPreset } from '../PythonPreset';

function formatPythonConstValue(constValue: unknown): string {
  if (typeof constValue === 'string') {
    return `'${constValue}'`;
  }
  if (typeof constValue === 'boolean') {
    return constValue ? 'True' : 'False';
  }
  return String(constValue);
}

function formatLiteralType(constValue: unknown): string {
  return `Literal[${formatPythonConstValue(constValue)}]`;
}

function buildFieldArgs(
  property: ConstrainedObjectPropertyModel,
  isOptional: boolean,
  constOptions?: { originalInput: unknown }
): string[] {
  const decoratorArgs: string[] = [];

  if (property.property.originalInput['description']) {
    decoratorArgs.push(
      `description='''${property.property.originalInput['description']}'''`
    );
  }

  if (constOptions) {
    decoratorArgs.push(
      `default=${formatPythonConstValue(constOptions.originalInput)}`
    );
    decoratorArgs.push('frozen=True');
  } else if (isOptional) {
    decoratorArgs.push('default=None');
  }

  const isUnwrappedDict =
    property.property instanceof ConstrainedDictionaryModel &&
    property.property.serializationType === 'unwrap';

  if (isUnwrappedDict) {
    decoratorArgs.push('exclude=True');
  }

  if (
    property.propertyName !== property.unconstrainedPropertyName &&
    !isUnwrappedDict
  ) {
    decoratorArgs.push(`alias='''${property.unconstrainedPropertyName}'''`);
  }

  return decoratorArgs;
}

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
  property({ property, model, renderer }) {
    const propertyName = property.propertyName;
    const constOptions = property.property.options.const;
    const isOptional =
      !property.required || property.property.options.isNullable === true;

    let type = property.property.type;
    if (isOptional) {
      type = `Optional[${type}]`;
    }
    if (constOptions) {
      renderer.dependencyManager.addDependency('from typing import Literal');
      type = formatLiteralType(constOptions.originalInput);
    }
    type = renderer.renderPropertyType({
      modelType: model.type,
      propertyType: type
    });

    const decoratorArgs = buildFieldArgs(property, isOptional, constOptions);

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
      if not key in serialized_self:
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
  for obj_key in unknown_object_properties:
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
