import { ClassRenderer } from '../../renderers/ClassRenderer';
import {
  getDictionary,
  getNormalProperties,
  getOriginalPropertyList
} from '../../../../helpers';
import {
  ConstrainedArrayModel,
  ConstrainedDictionaryModel,
  ConstrainedEnumModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel,
  ConstrainedTupleModel,
  ConstrainedUnionModel
} from '../../../../models';

/**
 * Render toJson property conversion - returns the value to assign to the JSON object property
 */
function renderToJsonProperty(
  modelInstanceVariable: string,
  model: ConstrainedMetaModel
): string {
  if (
    model instanceof ConstrainedReferenceModel &&
    !(model.ref instanceof ConstrainedEnumModel)
  ) {
    // Runtime check for .toJson() method to handle plain objects passed to constructor
    return `${modelInstanceVariable} && typeof ${modelInstanceVariable} === 'object' && 'toJson' in ${modelInstanceVariable} && typeof ${modelInstanceVariable}.toJson === 'function' ? ${modelInstanceVariable}.toJson() : ${modelInstanceVariable}`;
  }

  return modelInstanceVariable;
}

/**
 * Render `marshal` function based on model - delegates to toJson()
 */
export function renderMarshal(): string {
  return `public marshal(): string {
  return JSON.stringify(this.toJson());
}`;
}

/**
 * Render toJson logic for tuples - returns array with converted values
 */
function renderToJsonTuple(
  modelInstanceVariable: string,
  unconstrainedProperty: string,
  tuple: ConstrainedTupleModel
): string {
  const tupleAssignments = tuple.tuple.map((tupleEntry) => {
    const itemVar = `${modelInstanceVariable}[${tupleEntry.index}]`;
    const itemConversion = renderToJsonProperty(itemVar, tupleEntry.value);
    return `${itemVar} !== undefined ? ${itemConversion} : null`;
  });
  return `json["${unconstrainedProperty}"] = [${tupleAssignments.join(', ')}];`;
}

/**
 * Render toJson logic for arrays of unions
 */
function renderToJsonUnionArray(
  modelInstanceVariable: string,
  unconstrainedProperty: string,
  unionModel: ConstrainedUnionModel
): string {
  const hasUnionReference = unionModel.union.some(
    (model) =>
      model instanceof ConstrainedReferenceModel &&
      !(model.ref instanceof ConstrainedEnumModel)
  );

  if (hasUnionReference) {
    return `json["${unconstrainedProperty}"] = ${modelInstanceVariable}.map((item: any) =>
    item && typeof item === 'object' && 'toJson' in item && typeof item.toJson === 'function'
      ? item.toJson()
      : item
  );`;
  }

  return `json["${unconstrainedProperty}"] = ${modelInstanceVariable};`;
}

/**
 * Render toJson logic for arrays
 */
function renderToJsonArray(
  modelInstanceVariable: string,
  unconstrainedProperty: string,
  arrayModel: ConstrainedArrayModel
): string {
  if (
    arrayModel.valueModel instanceof ConstrainedReferenceModel &&
    !(arrayModel.valueModel.ref instanceof ConstrainedEnumModel)
  ) {
    return `json["${unconstrainedProperty}"] = ${modelInstanceVariable}.map((item: any) =>
    item && typeof item === 'object' && 'toJson' in item && typeof item.toJson === 'function'
      ? item.toJson()
      : item
  );`;
  }

  return `json["${unconstrainedProperty}"] = ${modelInstanceVariable};`;
}

/**
 * Render toJson logic for unions
 */
function renderToJsonUnion(
  modelInstanceVariable: string,
  unconstrainedProperty: string,
  unionModel: ConstrainedUnionModel
): string {
  const hasUnionReference = unionModel.union.some(
    (model) =>
      model instanceof ConstrainedReferenceModel &&
      !(model.ref instanceof ConstrainedEnumModel)
  );

  if (hasUnionReference) {
    return `if(${modelInstanceVariable} && typeof ${modelInstanceVariable} === 'object' && 'toJson' in ${modelInstanceVariable} && typeof ${modelInstanceVariable}.toJson === 'function') {
    json["${unconstrainedProperty}"] = ${modelInstanceVariable}.toJson();
  } else {
    json["${unconstrainedProperty}"] = ${modelInstanceVariable};
  }`;
  }

  return `json["${unconstrainedProperty}"] = ${modelInstanceVariable};`;
}

/**
 * Render toJson logic for dictionary types (additionalProperties)
 */
function renderToJsonDictionary(
  properties: Record<string, ConstrainedObjectPropertyModel>
): string[] {
  const unwrapDictionaryProperties = getDictionary(properties);
  const originalPropertyNames = getOriginalPropertyList(properties);

  return unwrapDictionaryProperties.map(([prop, propModel]) => {
    const dictValue = (propModel.property as ConstrainedDictionaryModel).value;
    let valueConversion: string;

    if (dictValue instanceof ConstrainedUnionModel) {
      const hasUnionReference = dictValue.union.some(
        (model) =>
          model instanceof ConstrainedReferenceModel &&
          !(model.ref instanceof ConstrainedEnumModel)
      );
      if (hasUnionReference) {
        valueConversion = `value && typeof value === 'object' && 'toJson' in value && typeof value.toJson === 'function' ? value.toJson() : value`;
      } else {
        valueConversion = 'value';
      }
    } else if (
      dictValue instanceof ConstrainedReferenceModel &&
      !(dictValue.ref instanceof ConstrainedEnumModel)
    ) {
      valueConversion = `value && typeof value === 'object' && 'toJson' in value && typeof value.toJson === 'function' ? value.toJson() : value`;
    } else {
      valueConversion = 'value';
    }

    return `if(this.${prop} !== undefined) {
  for (const [key, value] of this.${prop}.entries()) {
    //Only unwrap those that are not already a property in the JSON object
    if([${originalPropertyNames.map((v) => `"${v}"`).join(',')}].includes(String(key))) continue;
    json[key] = ${valueConversion};
  }
}`;
  });
}

/**
 * Render toJson code for all normal properties (not dictionaries with unwrap)
 */
function renderToJsonNormalProperties(
  properties: Record<string, ConstrainedObjectPropertyModel>
): string[] {
  const normalProperties = getNormalProperties(properties);

  return normalProperties.map(([prop, propModel]) => {
    const modelInstanceVariable = `this.${prop}`;
    let toJsonCode: string;

    if (
      propModel.property instanceof ConstrainedArrayModel &&
      propModel.property.valueModel instanceof ConstrainedUnionModel
    ) {
      toJsonCode = renderToJsonUnionArray(
        modelInstanceVariable,
        propModel.unconstrainedPropertyName,
        propModel.property.valueModel
      );
    } else if (propModel.property instanceof ConstrainedUnionModel) {
      toJsonCode = renderToJsonUnion(
        modelInstanceVariable,
        propModel.unconstrainedPropertyName,
        propModel.property
      );
    } else if (propModel.property instanceof ConstrainedArrayModel) {
      toJsonCode = renderToJsonArray(
        modelInstanceVariable,
        propModel.unconstrainedPropertyName,
        propModel.property
      );
    } else if (propModel.property instanceof ConstrainedTupleModel) {
      toJsonCode = renderToJsonTuple(
        modelInstanceVariable,
        propModel.unconstrainedPropertyName,
        propModel.property
      );
    } else {
      const propToJsonCode = renderToJsonProperty(
        modelInstanceVariable,
        propModel.property
      );
      toJsonCode = `json["${propModel.unconstrainedPropertyName}"] = ${propToJsonCode};`;
    }

    return `if(${modelInstanceVariable} !== undefined) {
  ${toJsonCode}
}`;
  });
}

/**
 * Render `toJson` function based on model
 */
export function renderToJson({
  renderer,
  model
}: {
  renderer: ClassRenderer;
  model: ConstrainedObjectModel;
}): string {
  const properties = model.properties || {};
  const toJsonNormalProperties = renderToJsonNormalProperties(properties);
  const toJsonDictionaryProperties = renderToJsonDictionary(properties);

  return `public toJson(): Record<string, unknown> {
  const json: Record<string, unknown> = {};
${renderer.indent(toJsonNormalProperties.join('\n'))}
${renderer.indent(toJsonDictionaryProperties.join('\n'))}
  return json;
}`;
}
