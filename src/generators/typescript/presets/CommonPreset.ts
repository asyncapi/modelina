import { TypeScriptPreset } from '../TypeScriptPreset';
import {
  ConstrainedObjectModel,
  ConstrainedDictionaryModel,
  ConstrainedReferenceModel,
  ConstrainedMetaModel,
  ConstrainedEnumModel,
  ConstrainedUnionModel,
  ConstrainedArrayModel
} from '../../../models';
import renderExampleFunction from './utils/ExampleFunction';
import { ClassRenderer } from '../renderers/ClassRenderer';

export interface TypeScriptCommonPresetOptions {
  marshalling: boolean;
  example: boolean;
}

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
    return `$\{${modelInstanceVariable}.marshal()}`;
  }

  return realizePropertyFactory(modelInstanceVariable);
}

function renderDictionarySerialization(
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
  const allUnionReferencesCondition = allUnionReferences.join(' || ');
  const hasUnionReference = allUnionReferences.length > 0;
  let unionSerialization = `${propName}.push(typeof unionItem === 'number' || typeof unionItem === 'boolean' ? unionItem : JSON.stringify(unionItem))`;
  if (hasUnionReference) {
    unionSerialization = `if(${allUnionReferencesCondition}) {
      ${propName}.push(unionItem.marshal());
    } else {
      ${propName}.push(typeof unionItem === 'number' || typeof unionItem === 'boolean' ? unionItem : JSON.stringify(unionItem))
    }`;
  }
  return `let ${propName}: any[] = [];
  for (const unionItem of ${modelInstanceVariable}) {
    ${unionSerialization}
  }
  json += \`"${unconstrainedProperty}": [\${${propName}.join(',')}],\`;`;
}
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
  const allUnionReferencesCondition = allUnionReferences.join(' || ');
  const hasUnionReference = allUnionReferences.length > 0;
  let unionSerialization = `${propName}.push(typeof unionItem === 'number' || typeof unionItem === 'boolean' ? unionItem : JSON.stringify(unionItem))`;
  if (hasUnionReference) {
    unionSerialization = `if(${allUnionReferencesCondition}) {
      ${propName}.push(unionItem.marshal());
    } else {
      ${propName}.push(typeof unionItem === 'number' || typeof unionItem === 'boolean' ? unionItem : JSON.stringify(unionItem))
    }`;
  }
  return `let ${propName}: any[] = [];
  for (const unionItem of ${modelInstanceVariable}) {
    ${unionSerialization}
  }
  json += \`"${unconstrainedProperty}": [\${${propName}.join(',')}],\`;`;
}
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
  const allUnionReferencesCondition = allUnionReferences.join(' || ');
  const hasUnionReference = allUnionReferences.length > 0;
  if (hasUnionReference) {
    return `if(${allUnionReferencesCondition}) {
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
function renderMarshalProperties(model: ConstrainedObjectModel) {
  const properties = model.properties || {};
  const propertyKeys = [...Object.entries(properties)];

  //These are a bit special as 'unwrap' dictionary models means they have to be unwrapped within the JSON object.
  const unwrapDictionaryProperties = propertyKeys.filter(
    ([, value]) =>
      value.property instanceof ConstrainedDictionaryModel &&
      value.property.serializationType === 'unwrap'
  );
  const normalProperties = propertyKeys.filter(
    ([, value]) =>
      !(value.property instanceof ConstrainedDictionaryModel) ||
      (value.property instanceof ConstrainedDictionaryModel &&
        value.property.serializationType !== 'unwrap')
  );

  const marshalNormalProperties = normalProperties.map(([prop, propModel]) => {
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

  const marshalUnwrapDictionaryProperties = unwrapDictionaryProperties.map(
    ([prop, propModel]) => {
      const modelInstanceVariable = 'value';
      const patternPropertyMarshalCode = renderMarshalProperty(
        modelInstanceVariable,
        (propModel.property as ConstrainedDictionaryModel).value
      );
      const marshalCode = `json += \`"$\{key}": ${patternPropertyMarshalCode},\`;`;
      return `if(this.${prop} !== undefined) { 
for (const [key, value] of this.${prop}.entries()) {
  //Only unwrap those that are not already a property in the JSON object
  if(Object.keys(this).includes(String(key))) continue;
    ${marshalCode}
  }
}`;
    }
  );

  return `
${marshalNormalProperties.join('\n')}
${marshalUnwrapDictionaryProperties.join('\n')}
`;
}

/**
 * Render `marshal` function based on model
 */
function renderMarshal({
  renderer,
  model
}: {
  renderer: ClassRenderer;
  model: ConstrainedObjectModel;
}): string {
  return `public marshal() : string {
  let json = '{'
${renderer.indent(renderMarshalProperties(model))}
  //Remove potential last comma 
  return \`$\{json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}\`;
}`;
}

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
function renderUnmarshalProperties(model: ConstrainedObjectModel) {
  const properties = model.properties || {};
  const propertyKeys = [...Object.entries(properties)];
  const originalPropertyNames = propertyKeys.map(([, model]) => {
    return model.unconstrainedPropertyName;
  });
  //These are a bit special as 'unwrap' dictionary models means they have to be unwrapped within the JSON object.
  const unwrapDictionaryProperties = [];
  const normalProperties = [];
  for (const entry of propertyKeys) {
    // if const value exists, we don't need to unmarshal this property because it exist in the class/interface
    if (entry[1].property.options.const) {
      continue;
    }

    if (
      entry[1].property instanceof ConstrainedDictionaryModel &&
      entry[1].property.serializationType === 'unwrap'
    ) {
      unwrapDictionaryProperties.push(entry);
    } else {
      normalProperties.push(entry);
    }
  }

  const unmarshalNormalProperties = normalProperties.map(
    ([prop, propModel]) => {
      const modelInstanceVariable = `obj["${propModel.unconstrainedPropertyName}"]`;
      const unmarshalCode = renderUnmarshalProperty(
        modelInstanceVariable,
        propModel.property
      );
      return `if (${modelInstanceVariable} !== undefined) {
  instance.${prop} = ${unmarshalCode};
}`;
    }
  );

  const setDictionaryProperties = [];
  const unmarshalDictionaryProperties = [];
  for (const [prop, propModel] of unwrapDictionaryProperties) {
    const modelInstanceVariable = 'value as any';
    const unmarshalCode = renderUnmarshalProperty(
      modelInstanceVariable,
      (propModel.property as ConstrainedDictionaryModel).value
    );
    setDictionaryProperties.push(
      `if (instance.${prop} === undefined) {instance.${prop} = new Map();}`
    );
    unmarshalDictionaryProperties.push(
      `instance.${prop}.set(key, ${unmarshalCode});`
    );
  }
  const corePropertyKeys = originalPropertyNames
    .map((propertyKey) => `"${propertyKey}"`)
    .join(',');
  const unwrappedDictionaryCode =
    setDictionaryProperties.length > 0
      ? `${setDictionaryProperties.join('\n')}
  for (const [key, value] of Object.entries(obj).filter((([key,]) => {return ![${corePropertyKeys}].includes(key);}))) {
    ${unmarshalDictionaryProperties.join('\n')}
  }`
      : '';

  return `${unmarshalNormalProperties.join('\n')}

${unwrappedDictionaryCode}`;
}

/**
 * Render `unmarshal` function based on model
 */
function renderUnmarshal({
  renderer,
  model
}: {
  renderer: ClassRenderer;
  model: ConstrainedObjectModel;
}): string {
  const unmarshalProperties = renderUnmarshalProperties(model);
  return `public static unmarshal(json: string | object): ${model.type} {
  const obj = typeof json === "object" ? json : JSON.parse(json);
  const instance = new ${model.type}({} as any);

${renderer.indent(unmarshalProperties)}
  return instance;
}`;
}

/**
 * Preset which adds `marshal`, `unmarshal`, `example` functions to class.
 *
 * @implements {TypeScriptPreset}
 */
export const TS_COMMON_PRESET: TypeScriptPreset<TypeScriptCommonPresetOptions> =
  {
    class: {
      additionalContent({ renderer, model, content, options }) {
        options = options || {};
        const blocks: string[] = [];

        if (options.marshalling === true) {
          blocks.push(renderMarshal({ renderer, model }));
          blocks.push(renderUnmarshal({ renderer, model }));
        }

        if (options.example === true) {
          blocks.push(renderExampleFunction({ model }));
        }

        return renderer.renderBlock([content, ...blocks], 2);
      }
    }
  };
