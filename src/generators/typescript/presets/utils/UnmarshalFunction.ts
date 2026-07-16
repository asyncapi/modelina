import { ClassRenderer } from '../../renderers/ClassRenderer';
import { TypeScriptOptions } from '../../TypeScriptGenerator';
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

type MapType = TypeScriptOptions['mapType'];

/**
 * The `== null` fallback value is only emitted when the declared type can hold
 * it, keeping `tsc` happy under strictNullChecks:
 *  - optional               -> `undefined`
 *  - nullable               -> `null`
 *  - required non-nullable  -> `undefined` (no fallback branch; assigning
 *    `null`/`undefined` to a non-nullable field would be TS2322).
 */
function nullFallbackFor(
  isOptional: boolean,
  model: ConstrainedMetaModel
): string | undefined {
  if (isOptional) {
    return 'undefined';
  }
  if (model.options?.isNullable === true) {
    return 'null';
  }
  return undefined;
}

/**
 * Whether a model is a nested model reference (not an enum) that exposes
 * `.fromJson()`.
 */
function isModelReference(model: ConstrainedMetaModel): boolean {
  return (
    model instanceof ConstrainedReferenceModel &&
    !(model.ref instanceof ConstrainedEnumModel)
  );
}

/**
 * Wrap an expression with a `== null` guard when the declared type can hold the
 * fallback; otherwise return the expression untouched.
 */
function withNullFallback(
  modelInstanceVariable: string,
  nullFallback: string | undefined,
  expression: string
): string {
  return nullFallback === undefined
    ? expression
    : `${modelInstanceVariable} == null
    ? ${nullFallback}
    : ${expression}`;
}

/**
 * Build the expression that rebuilds a normal (non-unwrap) dictionary. It is a
 * `Map` at runtime but arrives as a plain object in JSON, so it is reconstructed
 * from the object entries, recursing into nested models.
 */
function renderDictionaryFromJson(
  modelInstanceVariable: string,
  dictionaryModel: ConstrainedDictionaryModel,
  mapType: MapType
): string {
  const valueModel = dictionaryModel.value;
  if (mapType === 'map') {
    if (isModelReference(valueModel)) {
      return `new Map(Object.entries(${modelInstanceVariable} as Record<string, unknown>).map(([key, value]): [string, ${valueModel.type}] => [key, ${valueModel.type}.fromJson(value as Record<string, unknown>)]))`;
    }
    return `new Map(Object.entries(${modelInstanceVariable} as Record<string, ${valueModel.type}>))`;
  }
  // record / indexedObject: the property is a plain object at runtime, matching
  // the JSON shape. Only nested model references need recursing into.
  if (isModelReference(valueModel)) {
    return `Object.fromEntries(Object.entries(${modelInstanceVariable} as Record<string, unknown>).map(([key, value]): [string, ${valueModel.type}] => [key, ${valueModel.type}.fromJson(value as Record<string, unknown>)])) as ${dictionaryModel.type}`;
  }
  return `${modelInstanceVariable} as ${dictionaryModel.type}`;
}

/**
 * Render the fromJson property value - uses .fromJson() for nested models
 */
function renderFromJsonProperty(
  modelInstanceVariable: string,
  model: ConstrainedMetaModel,
  mapType: MapType,
  isOptional: boolean = false
): string {
  const nullFallback = nullFallbackFor(isOptional, model);
  if (isModelReference(model)) {
    return `${model.type}.fromJson(${modelInstanceVariable} as Record<string, unknown>)`;
  }

  if (
    model instanceof ConstrainedArrayModel &&
    isModelReference(model.valueModel) &&
    !(model.valueModel instanceof ConstrainedUnionModel)
  ) {
    const mapExpression = `(${modelInstanceVariable} as Record<string, unknown>[]).map((item: Record<string, unknown>) => ${model.valueModel.type}.fromJson(item))`;
    return withNullFallback(modelInstanceVariable, nullFallback, mapExpression);
  }

  if (model instanceof ConstrainedDictionaryModel) {
    const mapExpression = renderDictionaryFromJson(
      modelInstanceVariable,
      model,
      mapType
    );
    return withNullFallback(modelInstanceVariable, nullFallback, mapExpression);
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
      ? `new Date(${modelInstanceVariable} as string)`
      : `${modelInstanceVariable} == null ? ${nullFallback} : new Date(${modelInstanceVariable} as string)`;
  }

  // Plain passthrough: `obj[...]` narrows to `{} | null` after the `!== undefined`
  // guard, so it must be asserted to the property's declared type — otherwise the
  // generated assignment fails to compile under `strict`/`strictNullChecks`.
  return `${modelInstanceVariable} as ${model.type}`;
}

/**
 * Render the code for fromJson of regular properties
 */
function fromJsonRegularProperty(
  propModel: ConstrainedObjectPropertyModel,
  mapType: MapType
): string | undefined {
  if (propModel.property.options.const) {
    return undefined;
  }

  const modelInstanceVariable = `obj["${propModel.unconstrainedPropertyName}"]`;
  const isOptional = propModel.required === false;
  const fromJsonCode = renderFromJsonProperty(
    modelInstanceVariable,
    propModel.property,
    mapType,
    isOptional
  );
  return `if (${modelInstanceVariable} !== undefined) {
  instance.${propModel.propertyName} = ${fromJsonCode};
}`;
}

/**
 * Render the code for fromJson of unwrappable dictionary models
 */
function fromJsonDictionary(
  model: ConstrainedObjectModel,
  mapType: MapType
): string {
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
      (propModel.property as ConstrainedDictionaryModel).value,
      mapType
    );
    if (mapType === 'map') {
      setDictionaryProperties.push(`instance.${prop} = new Map();`);
      fromJsonDictionaryProperties.push(
        `instance.${prop}.set(key, ${fromJsonCode});`
      );
    } else {
      // record / indexedObject: the dictionary is a plain object at runtime.
      setDictionaryProperties.push(`instance.${prop} = {};`);
      fromJsonDictionaryProperties.push(
        `instance.${prop}[key] = ${fromJsonCode};`
      );
    }
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
  const mapType = renderer.generator.options.mapType;
  const normalProperties = getNormalProperties(properties);
  const fromJsonNormalProperties = normalProperties.map(([, propModel]) =>
    fromJsonRegularProperty(propModel, mapType)
  );
  const fromJsonDictionaryCode = fromJsonDictionary(model, mapType);

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
