import { ClassRenderer } from '../../renderers/ClassRenderer';
import { getDictionary, getNormalProperties } from '../../../../helpers';
import {
  ConstrainedArrayModel,
  ConstrainedDictionaryModel,
  ConstrainedEnumModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedUnionModel
} from '../../../../models';

/**
 * Render the fromJson property value - uses .fromJson() for nested models
 */
function renderFromJsonProperty(
  modelInstanceVariable: string,
  model: ConstrainedMetaModel,
  isOptional: boolean = false
): string {
  const nullValue = isOptional ? 'undefined' : 'null';
  if (
    model instanceof ConstrainedReferenceModel &&
    !(model.ref instanceof ConstrainedEnumModel)
  ) {
    return `${model.type}.fromJson(${modelInstanceVariable} as Record<string, unknown>)`;
  }

  if (
    model instanceof ConstrainedArrayModel &&
    model.valueModel instanceof ConstrainedReferenceModel &&
    !(model.valueModel.ref instanceof ConstrainedEnumModel) &&
    !(model.valueModel instanceof ConstrainedUnionModel)
  ) {
    return `${modelInstanceVariable} == null
    ? ${nullValue}
    : (${modelInstanceVariable} as Record<string, unknown>[]).map((item: Record<string, unknown>) => ${model.valueModel.type}.fromJson(item))`;
  }

  // Date-typed properties need string→Date conversion
  // Note: 'time' is excluded - time-only strings (e.g., "14:30:00") are not valid Date constructor arguments
  if (
    model instanceof ConstrainedStringModel &&
    ['date', 'date-time'].includes(model.options?.format ?? '')
  ) {
    // Null check prevents new Date(null) → epoch date
    return `${modelInstanceVariable} == null ? ${nullValue} : new Date(${modelInstanceVariable} as string)`;
  }

  return `${modelInstanceVariable}`;
}

/**
 * Render the code for fromJson of regular properties
 */
function fromJsonRegularProperty(
  propModel: ConstrainedObjectPropertyModel
): string | undefined {
  if (propModel.property.options.const) {
    return undefined;
  }

  const modelInstanceVariable = `obj["${propModel.unconstrainedPropertyName}"]`;
  const isOptional = propModel.required === false;
  const fromJsonCode = renderFromJsonProperty(
    modelInstanceVariable,
    propModel.property,
    isOptional
  );
  return `if (${modelInstanceVariable} !== undefined) {
  instance.${propModel.propertyName} = ${fromJsonCode};
}`;
}

/**
 * Render the code for fromJson of unwrappable dictionary models
 */
function fromJsonDictionary(model: ConstrainedObjectModel): string {
  const setDictionaryProperties: string[] = [];
  const fromJsonDictionaryProperties: string[] = [];
  const properties = model.properties || {};
  const propertyKeys = [...Object.entries(properties)];
  const originalPropertyNames = propertyKeys.map(([, model]) => {
    return model.unconstrainedPropertyName;
  });
  const unwrapDictionaryProperties = getDictionary(properties);

  for (const [prop, propModel] of unwrapDictionaryProperties) {
    const modelInstanceVariable = 'value';
    const fromJsonCode = renderFromJsonProperty(
      modelInstanceVariable,
      (propModel.property as ConstrainedDictionaryModel).value
    );
    setDictionaryProperties.push(`instance.${prop} = new Map();`);
    fromJsonDictionaryProperties.push(
      `instance.${prop}.set(key, ${fromJsonCode});`
    );
  }

  const corePropertyKeys = originalPropertyNames
    .map((propertyKey) => `"${propertyKey}"`)
    .join(',');
  if (setDictionaryProperties.length > 0) {
    return `${setDictionaryProperties.join('\n')}
const propsToCheck = Object.entries(obj).filter((([key,]) => {return ![${corePropertyKeys}].includes(key);}));
for (const [key, value] of propsToCheck) {
  ${fromJsonDictionaryProperties.join('\n')}
}`;
  }
  return '';
}

/**
 * Render `fromJson` function based on model
 */
export function renderFromJson({
  renderer,
  model
}: {
  renderer: ClassRenderer;
  model: ConstrainedObjectModel;
}): string {
  const properties = model.properties || {};
  const normalProperties = getNormalProperties(properties);
  const fromJsonNormalProperties = normalProperties.map(([, propModel]) =>
    fromJsonRegularProperty(propModel)
  );
  const fromJsonDictionaryCode = fromJsonDictionary(model);

  return `public static fromJson(obj: Record<string, unknown>): ${model.type} {
  const instance = new ${model.type}({} as any);

${renderer.indent(fromJsonNormalProperties.join('\n'))}

${renderer.indent(fromJsonDictionaryCode)}
  return instance;
}`;
}

/**
 * Render `unmarshal` function based on model - delegates to fromJson()
 */
export function renderUnmarshal({
  model
}: {
  renderer: ClassRenderer;
  model: ConstrainedObjectModel;
}): string {
  return `public static unmarshal(json: string | object): ${model.type} {
  const obj = typeof json === "object" ? json : JSON.parse(json);
  return ${model.type}.fromJson(obj as Record<string, unknown>);
}`;
}
