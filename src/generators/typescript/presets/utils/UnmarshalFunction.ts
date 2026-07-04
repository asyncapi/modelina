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
 * Render the unmarshalled value
 */
function renderUnmarshalProperty(
  modelInstanceVariable: string,
  model: ConstrainedMetaModel,
  isOptional: boolean = false
) {
  // The null-fallback is only emitted when the declared type can hold it:
  //  - optional               -> `undefined`
  //  - nullable               -> `null`
  //  - required non-nullable  -> no fallback (assigning `null`/`undefined` to a
  //    non-nullable field is a strictNullChecks error, TS2322).
  const isNullable = model.options?.isNullable === true;
  let nullFallback: string | undefined;
  if (isOptional) {
    nullFallback = 'undefined';
  } else if (isNullable) {
    nullFallback = 'null';
  }
  if (
    model instanceof ConstrainedReferenceModel &&
    !(model.ref instanceof ConstrainedEnumModel)
  ) {
    return `${model.type}.unmarshal(${modelInstanceVariable})`;
  }

  if (
    model instanceof ConstrainedArrayModel &&
    model.valueModel instanceof ConstrainedReferenceModel &&
    !(model.valueModel.ref instanceof ConstrainedEnumModel) &&
    !(model.valueModel instanceof ConstrainedUnionModel)
  ) {
    const mapExpression = `${modelInstanceVariable}.map((item: any) => ${model.valueModel.type}.unmarshal(item))`;
    return nullFallback === undefined
      ? mapExpression
      : `${modelInstanceVariable} == null
    ? ${nullFallback}
    : ${mapExpression}`;
  }

  // Date-typed properties need string→Date conversion
  // Note: 'time' is excluded - time-only strings (e.g., "14:30:00") are not valid Date constructor arguments
  if (
    model instanceof ConstrainedStringModel &&
    ['date', 'date-time'].includes(model.options?.format ?? '')
  ) {
    // Null check prevents new Date(null) → epoch date, but only emit the
    // fallback branch when the declared type can hold it.
    return nullFallback === undefined
      ? `new Date(${modelInstanceVariable})`
      : `${modelInstanceVariable} == null ? ${nullFallback} : new Date(${modelInstanceVariable})`;
  }

  return `${modelInstanceVariable}`;
}

/**
 * Render the code for unmarshalling of regular properties
 */
function unmarshalRegularProperty(propModel: ConstrainedObjectPropertyModel) {
  if (propModel.property.options.const) {
    return undefined;
  }

  const modelInstanceVariable = `obj["${propModel.unconstrainedPropertyName}"]`;
  const isOptional = propModel.required === false;
  const unmarshalCode = renderUnmarshalProperty(
    modelInstanceVariable,
    propModel.property,
    isOptional
  );
  return `if (${modelInstanceVariable} !== undefined) {
  instance.${propModel.propertyName} = ${unmarshalCode};
}`;
}

/**
 * Render the code for unmarshalling unwrappable dictionary models
 */
function unmarshalDictionary(model: ConstrainedObjectModel) {
  const setDictionaryProperties = [];
  const unmarshalDictionaryProperties = [];
  const properties = model.properties || {};
  const propertyKeys = [...Object.entries(properties)];
  const originalPropertyNames = propertyKeys.map(([, model]) => {
    return model.unconstrainedPropertyName;
  });
  const unwrapDictionaryProperties = getDictionary(properties);

  for (const [prop, propModel] of unwrapDictionaryProperties) {
    const modelInstanceVariable = 'value as any';
    const unmarshalCode = renderUnmarshalProperty(
      modelInstanceVariable,
      (propModel.property as ConstrainedDictionaryModel).value
    );
    setDictionaryProperties.push(`instance.${prop} = new Map();`);
    unmarshalDictionaryProperties.push(
      `instance.${prop}.set(key, ${unmarshalCode});`
    );
  }

  const corePropertyKeys = originalPropertyNames
    .map((propertyKey) => `"${propertyKey}"`)
    .join(',');
  if (setDictionaryProperties.length > 0) {
    return `${setDictionaryProperties.join('\n')}
const propsToCheck = Object.entries(obj).filter((([key,]) => {return ![${corePropertyKeys}].includes(key);}));
for (const [key, value] of propsToCheck) {
  ${unmarshalDictionaryProperties.join('\n')}
}`;
  }
  return '';
}

/**
 * Render `unmarshal` function based on model
 */
export function renderUnmarshal({
  renderer,
  model
}: {
  renderer: ClassRenderer;
  model: ConstrainedObjectModel;
}): string {
  const properties = model.properties || {};
  const normalProperties = getNormalProperties(properties);
  const unmarshalNormalProperties = normalProperties.map(([, propModel]) =>
    unmarshalRegularProperty(propModel)
  );
  const unwrappedDictionaryCode = unmarshalDictionary(model);

  return `public static unmarshal(json: string | object): ${model.type} {
  const obj = typeof json === "object" ? json : JSON.parse(json);
  const instance = new ${model.type}({} as any);

${renderer.indent(unmarshalNormalProperties.join('\n'))}
  
${renderer.indent(unwrappedDictionaryCode)}
  return instance;
}`;
}
