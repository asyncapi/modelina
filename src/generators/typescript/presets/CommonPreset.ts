
import { TypeScriptPreset } from '../TypeScriptPreset';
import { ConstrainedObjectModel, ConstrainedDictionaryModel, ConstrainedReferenceModel, ConstrainedMetaModel, ConstrainedEnumModel } from '../../../models';
import renderExampleFunction from './utils/ExampleFunction';
import { ClassRenderer } from '../renderers/ClassRenderer';

export interface TypeScriptCommonPresetOptions {
  marshalling: boolean;
  example: boolean;
}

function realizePropertyFactory(prop: string) {
  return `$\{typeof ${prop} === 'number' || typeof ${prop} === 'boolean' ? ${prop} : JSON.stringify(${prop})}`;
}

function renderMarshalProperty(modelInstanceVariable: string, model: ConstrainedMetaModel) {
  if (model instanceof ConstrainedReferenceModel && !(model.ref instanceof ConstrainedEnumModel)) {
    return `$\{${model.type}.marshal()}`;
  }
  return realizePropertyFactory(modelInstanceVariable);
}
function renderMarshalProperties(model: ConstrainedObjectModel) {
  const properties = model.properties || {};
  const propertyKeys = [...Object.entries(properties)];

  //These are a bit special as 'unwrap' dictionary models means they have to be unwrapped within the JSON object.
  const unwrapDictionaryProperties = [];
  const normalProperties = [];
  for (const entry of propertyKeys) {
    if (entry[1] instanceof ConstrainedDictionaryModel && entry[1].serializationType === 'unwrap') {
      unwrapDictionaryProperties.push(entry);
    } else {
      normalProperties.push(entry);
    }
  }

  const marshalNormalProperties = normalProperties.map(([prop, propModel]) => {
    const modelInstanceVariable = `this.${prop}`;
    const propMarshalCode = renderMarshalProperty(modelInstanceVariable, propModel.property);
    const marshalCode = `json += \`"${propModel.unconstrainedPropertyName}": ${propMarshalCode},\`;`;
    return `if(${modelInstanceVariable} !== undefined) {
  ${marshalCode} 
}`;
  });

  const marshalUnwrapDictionaryProperties = unwrapDictionaryProperties.map(([prop, propModel]) => {
    const modelInstanceVariable = 'value';
    const patternPropertyMarshalCode = renderMarshalProperty(modelInstanceVariable, propModel.property);
    const marshalCode = `json += \`"$\{key}": ${patternPropertyMarshalCode},\`;`;
    return `if(this.${prop} !== undefined) { 
for (const [key, value] of this.${prop}.entries()) {
  //Only unwrap those who are not already a property in the JSON object
  if(Object.keys(this).includes(String(key))) continue;
    ${marshalCode}
  }
}`;
  });

  return `
${marshalNormalProperties.join('\n')}
${marshalUnwrapDictionaryProperties.join('\n')}
`;
}

/**
 * Render `marshal` function based on model
 */
function renderMarshal({ renderer, model }: {
  renderer: ClassRenderer,
  model: ConstrainedObjectModel
}): string {
  return `public marshal() : string {
  let json = '{'
${renderer.indent(renderMarshalProperties(model))}
  //Remove potential last comma 
  return \`$\{json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}\`;
}`;
} 

function renderUnmarshalProperty(modelInstanceVariable: string, model: ConstrainedMetaModel) {
  if (model instanceof ConstrainedReferenceModel && !(model.ref instanceof ConstrainedEnumModel)) {
    return `$\{${model.type}.marshal()}`;
  }
  return `${modelInstanceVariable}`;
}
function renderUnmarshalProperties(model: ConstrainedObjectModel) {
  const properties = model.properties || {};
  const propertyKeys = [...Object.entries(properties)];
  const propertyNames = propertyKeys.map(([name,]) => {return name;});
  //These are a bit special as 'unwrap' dictionary models means they have to be unwrapped within the JSON object.
  const unwrapDictionaryProperties = [];
  const normalProperties = [];
  for (const entry of propertyKeys) {
    if (entry[1] instanceof ConstrainedDictionaryModel && entry[1].serializationType === 'unwrap') {
      unwrapDictionaryProperties.push(entry);
    } else {
      normalProperties.push(entry);
    }
  }

  const unmarshalNormalProperties = normalProperties.map(([prop, propModel]) => {
    const modelInstanceVariable = `obj["${propModel.unconstrainedPropertyName}"]`;
    const unmarshalCode = renderUnmarshalProperty(modelInstanceVariable, propModel.property);
    return `if (${modelInstanceVariable} !== undefined) {
  instance.${prop} = ${unmarshalCode};
}`;
  });

  const setDictionaryProperties = [];
  const unmarshalDictionaryProperties = [];
  for (const [prop, propModel] of unwrapDictionaryProperties) {
    const modelInstanceVariable = 'value as any';
    const unmarshalCode = renderUnmarshalProperty(modelInstanceVariable, propModel.property);
    setDictionaryProperties.push(`if (instance.${prop} === undefined) {instance.${prop} = new Map();}`);
    unmarshalDictionaryProperties.push(`instance.${prop}.set(key, ${unmarshalCode});`);
  }
  const corePropertyKeys = propertyNames.map((propertyKey) => `"${propertyKey}"`).join(',');
  const unwrappedDictionaryCode = setDictionaryProperties.length > 0 ? `${setDictionaryProperties.join('\n')}
  for (const [key, value] of Object.entries(obj).filter((([key,]) => {return ![${corePropertyKeys}].includes(key);}))) {
    ${unmarshalDictionaryProperties.join('\n')}
  }` : '';

  return `
${unmarshalNormalProperties.join('\n')}

${unwrappedDictionaryCode}
`;
}

/**
 * Render `unmarshal` function based on model
 */
function renderUnmarshal({ renderer, model }: {
  renderer: ClassRenderer,
  model: ConstrainedObjectModel
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
export const TS_COMMON_PRESET: TypeScriptPreset<TypeScriptCommonPresetOptions> = {
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
    },
  },
  class_test: {
    additionalContent({}) {
      return ''
    }
  }
};
