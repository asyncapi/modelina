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

function realizePropertyFactory(prop: string) {
  return `$\{typeof ${prop} === 'number' || typeof ${prop} === 'boolean' ? ${prop} : JSON.stringify(${prop})}`;
}

function renderMarshalProperty(
  modelInstanceVariable: string,
  model: ConstrainedMetaModel
) {
  if (
    model instanceof ConstrainedReferenceModel &&
    !(model.ref instanceof ConstrainedEnumModel)
  ) {
    // Runtime check for .marshal() method to handle plain objects passed to constructor
    return `$\{${modelInstanceVariable} && typeof ${modelInstanceVariable} === 'object' && 'marshal' in ${modelInstanceVariable} && typeof ${modelInstanceVariable}.marshal === 'function' ? ${modelInstanceVariable}.marshal() : JSON.stringify(${modelInstanceVariable})}`;
  }

  return realizePropertyFactory(modelInstanceVariable);
}

/**
 * Render marshalling logic for tuples
 */
function renderTupleSerialization(
  modelInstanceVariable: string,
  unconstrainedProperty: string,
  tuple: ConstrainedTupleModel
) {
  const t = tuple.tuple.map((tupleEntry) => {
    const temp = renderMarshalProperty(
      `${modelInstanceVariable}[${tupleEntry.index}]`,
      tupleEntry.value
    );
    return `if(${modelInstanceVariable}[${tupleEntry.index}]) {
  serializedTuple[${tupleEntry.index}] = \`${temp}\`
} else {
  serializedTuple[${tupleEntry.index}] = null;
}`;
  });
  return `const serializedTuple: any[] = [];
${t.join('\n')}
json += \`"${unconstrainedProperty}": [\${serializedTuple.join(',')}],\`;`;
}

/**
 * Render marshalling logic for unions
 */
function renderUnionSerializationArray(
  modelInstanceVariable: string,
  prop: string,
  unconstrainedProperty: string,
  unionModel: ConstrainedUnionModel
) {
  const propName = `${prop}JsonValues`;
  const allUnionReferences = unionModel.union
    .filter((model) => {
      return (
        model instanceof ConstrainedReferenceModel &&
        !(model.ref instanceof ConstrainedEnumModel)
      );
    })
    .map((model) => {
      return `unionItem instanceof ${model.type}`;
    });
  const hasUnionReference = allUnionReferences.length > 0;
  let unionSerialization = `${propName}.push(typeof unionItem === 'number' || typeof unionItem === 'boolean' ? unionItem : JSON.stringify(unionItem))`;
  if (hasUnionReference) {
    // Runtime check for .marshal() method to handle plain objects
    unionSerialization = `if(unionItem && typeof unionItem === 'object' && 'marshal' in unionItem && typeof unionItem.marshal === 'function') {
      ${propName}.push(unionItem.marshal());
    } else {
      ${propName}.push(typeof unionItem === 'number' || typeof unionItem === 'boolean' ? unionItem : JSON.stringify(unionItem))
    }`;
  }
  return `const ${propName}: any[] = [];
  for (const unionItem of ${modelInstanceVariable}) {
    ${unionSerialization}
  }
  json += \`"${unconstrainedProperty}": [\${${propName}.join(',')}],\`;`;
}

/**
 * Render marshalling logic for Arrays
 */
function renderArraySerialization(
  modelInstanceVariable: string,
  prop: string,
  unconstrainedProperty: string,
  arrayModel: ConstrainedArrayModel
) {
  const propName = `${prop}JsonValues`;
  return `let ${propName}: any[] = [];
  for (const unionItem of ${modelInstanceVariable}) {
    ${propName}.push(\`${renderMarshalProperty(
      'unionItem',
      arrayModel.valueModel
    )}\`);
  }
  json += \`"${unconstrainedProperty}": [\${${propName}.join(',')}],\`;`;
}

/**
 * Render marshalling logic for unions
 */
function renderUnionSerialization(
  modelInstanceVariable: string,
  unconstrainedProperty: string,
  unionModel: ConstrainedUnionModel
) {
  const allUnionReferences = unionModel.union
    .filter((model) => {
      return (
        model instanceof ConstrainedReferenceModel &&
        !(model.ref instanceof ConstrainedEnumModel)
      );
    })
    .map((model) => {
      return `${modelInstanceVariable} instanceof ${model.type}`;
    });
  const hasUnionReference = allUnionReferences.length > 0;
  if (hasUnionReference) {
    // Runtime check for .marshal() method to handle plain objects
    return `if(${modelInstanceVariable} && typeof ${modelInstanceVariable} === 'object' && 'marshal' in ${modelInstanceVariable} && typeof ${modelInstanceVariable}.marshal === 'function') {
      json += \`"${unconstrainedProperty}": $\{${modelInstanceVariable}.marshal()},\`;
    } else {
      json += \`"${unconstrainedProperty}": ${realizePropertyFactory(
        modelInstanceVariable
      )},\`;
    }`;
  }
  return `json += \`"${unconstrainedProperty}": ${realizePropertyFactory(
    modelInstanceVariable
  )},\`;`;
}

/**
 * Render marshalling logic for dictionary types
 */
function renderDictionarySerialization(
  properties: Record<string, ConstrainedObjectPropertyModel>
) {
  const unwrapDictionaryProperties = getDictionary(properties);
  const originalPropertyNames = getOriginalPropertyList(properties);
  return unwrapDictionaryProperties.map(([prop, propModel]) => {
    let dictionaryValueType;
    if (
      (propModel.property as ConstrainedDictionaryModel).value instanceof
      ConstrainedUnionModel
    ) {
      dictionaryValueType = renderUnionSerialization(
        'value',
        '${key}',
        (propModel.property as ConstrainedDictionaryModel)
          .value as ConstrainedUnionModel
      );
    } else {
      const type = renderMarshalProperty('value', propModel.property);
      dictionaryValueType = `json += \`"$\{key}": ${type},\`;`;
    }
    return `if(this.${prop} !== undefined) { 
  for (const [key, value] of this.${prop}.entries()) {
    //Only unwrap those that are not already a property in the JSON object
    if([${originalPropertyNames
      .map((value) => `"${value}"`)
      .join(',')}].includes(String(key))) continue;
    ${dictionaryValueType}
  }
}`;
  });
}

/**
 * Render marshalling code for all the normal properties (not dictionaries with unwrap)
 */
function renderNormalProperties(
  properties: Record<string, ConstrainedObjectPropertyModel>
) {
  const normalProperties = getNormalProperties(properties);

  return normalProperties.map(([prop, propModel]) => {
    const modelInstanceVariable = `this.${prop}`;
    let marshalCode;
    if (
      propModel.property instanceof ConstrainedArrayModel &&
      propModel.property.valueModel instanceof ConstrainedUnionModel
    ) {
      marshalCode = renderUnionSerializationArray(
        modelInstanceVariable,
        prop,
        propModel.unconstrainedPropertyName,
        propModel.property.valueModel
      );
    } else if (propModel.property instanceof ConstrainedUnionModel) {
      marshalCode = renderUnionSerialization(
        modelInstanceVariable,
        propModel.unconstrainedPropertyName,
        propModel.property
      );
    } else if (propModel.property instanceof ConstrainedArrayModel) {
      marshalCode = renderArraySerialization(
        modelInstanceVariable,
        prop,
        propModel.unconstrainedPropertyName,
        propModel.property
      );
    } else if (propModel.property instanceof ConstrainedTupleModel) {
      marshalCode = renderTupleSerialization(
        modelInstanceVariable,
        propModel.unconstrainedPropertyName,
        propModel.property
      );
    } else {
      const propMarshalCode = renderMarshalProperty(
        modelInstanceVariable,
        propModel.property
      );
      marshalCode = `json += \`"${propModel.unconstrainedPropertyName}": ${propMarshalCode},\`;`;
    }
    return `if(${modelInstanceVariable} !== undefined) {
  ${marshalCode}
}`;
  });
}

/**
 * Render `marshal` function based on model
 */
export function renderMarshal({
  renderer,
  model
}: {
  renderer: ClassRenderer;
  model: ConstrainedObjectModel;
}): string {
  const properties = model.properties || {};
  const marshalNormalProperties = renderNormalProperties(properties);
  const marshalUnwrapDictionaryProperties =
    renderDictionarySerialization(properties);

  return `public marshal() : string {
  let json = '{'
${renderer.indent(marshalNormalProperties.join('\n'))}
${renderer.indent(marshalUnwrapDictionaryProperties.join('\n'))}
  //Remove potential last comma 
  return \`$\{json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}\`;
}`;
}
