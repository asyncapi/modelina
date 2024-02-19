import { ClassRenderer } from '../../renderers/ClassRenderer';
import { getDictionary, getNormalProperties } from '../../../../helpers';
import {
  ConstrainedDictionaryModel,
  ConstrainedEnumModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel
} from '../../../../models';

/**
 * Render the unmarshalled value
 */
function renderUnmarshalProperty(
  modelInstanceVariable: string,
  model: ConstrainedMetaModel
) {
  if (
    model instanceof ConstrainedReferenceModel &&
    !(model.ref instanceof ConstrainedEnumModel)
  ) {
    return `${model.type}.unmarshal(${modelInstanceVariable})`;
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
  const unmarshalCode = renderUnmarshalProperty(
    modelInstanceVariable,
    propModel.property
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
