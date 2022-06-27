import { JavaScriptRenderer } from '../JavaScriptRenderer';
import { JavaScriptPreset } from '../JavaScriptPreset';
import { getUniquePropertyName, DefaultPropertyNames, TypeHelpers, ModelKind } from '../../../helpers';
import { CommonInputModel, CommonModel, ConstrainedDictionaryModel, ConstrainedEnumModel, ConstrainedMetaModel, ConstrainedObjectModel, ConstrainedReferenceModel } from '../../../models';
import renderExampleFunction from './utils/ExampleFunction';

export interface JavaScriptCommonPresetOptions {
  marshalling: boolean;
  example: boolean;
}

function realizePropertyFactory(prop: string) {
  return `$\{typeof ${prop} === 'number' || typeof ${prop} === 'boolean' ? ${prop} : JSON.stringify(${prop})}`;
}
function renderMarshalProperty(modelInstanceVariable: string, model: ConstrainedMetaModel) {
  if (model instanceof ConstrainedReferenceModel && !(model.ref instanceof ConstrainedEnumModel)) {
    //Referenced enums only need standard marshalling, so lets filter those away
    return `$\{${modelInstanceVariable}.marshal()}`;
  }
  return realizePropertyFactory(modelInstanceVariable);
}
function renderMarshalProperties(model: ConstrainedObjectModel) {
  const properties = model.properties || {};
  const propertyKeys = [...Object.entries(properties)];
  const marshalProperties = propertyKeys.map(([prop, propModel]) => {
    const modelInstanceVariable = `this.${prop}`;
    const propMarshalCode = renderMarshalProperty(modelInstanceVariable, propModel.property);
    const marshalCode = `json += \`"${prop}": ${propMarshalCode},\`;`;
    return `if(${modelInstanceVariable} !== undefined) {
  ${marshalCode} 
}`;
  });
  return marshalProperties.join('\n');
}

function renderMarshalAdditionalProperties(model: CommonModel) {
  let marshalAdditionalProperties = '';
  if (model.additionalProperties !== undefined) {
    const modelInstanceVariable = 'value';
    const patternPropertyMarshalCode = renderMarshalProperty(modelInstanceVariable, model.additionalProperties, inputModel);
    const marshalCode = `json += \`"$\{key}": ${patternPropertyMarshalCode},\`;`;
    marshalAdditionalProperties = `if(this.${additionalPropertyName} !== undefined) { 
  for (const [key, value] of this.${additionalPropertyName}.entries()) {
    //Only render additionalProperties which are not already a property
    if(Object.keys(this).includes(String(key))) continue;
    ${marshalCode}
  }
}`;
  }
  return marshalAdditionalProperties;
}

/**
 * Render `marshal` function based on model
 */
function renderMarshal({ renderer, model }: {
  renderer: JavaScriptRenderer<any>,
  model: ConstrainedObjectModel
}): string {
  return `marshal(){
  let json = '{'
${renderer.indent(renderMarshalProperties(model))}

  //Remove potential last comma 
  return \`$\{json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}\`;
}`;
}

function renderUnmarshalProperty(modelInstanceVariable: string, model: ConstrainedMetaModel) {
  //Referenced enums only need standard marshalling, so lets filter those away
  if (model instanceof ConstrainedReferenceModel && model.ref instanceof ConstrainedEnumModel) {
    return `${model.type}.unmarshal(${modelInstanceVariable})`;
  }
  return `${modelInstanceVariable}`;
}
function renderUnmarshalProperties(model: ConstrainedObjectModel) {
  const properties = model.properties || {};
  const propertyKeys = [...Object.entries(properties)];
  const unwrappedDictionaryProperties = propertyKeys.filter(([,propModel]) => propModel instanceof ConstrainedDictionaryModel && propModel.serializationType === 'unwrap');
  const normalProperties = propertyKeys.filter(([,propModel]) => !(propModel instanceof ConstrainedDictionaryModel) || propModel.serializationType === 'normal');
  const unmarshalNormalProperties = normalProperties.map(([prop, propModel]) => {
    const modelInstanceVariable = `obj["${prop}"]`;
    const unmarshalCode = renderUnmarshalProperty(modelInstanceVariable, propModel.property);
    return `if (${modelInstanceVariable} !== undefined) {
  instance.${prop} = ${unmarshalCode};
}`;
  });


  return `
${unmarshalNormalProperties.join('\n')}

`;
}

function renderUnmarshalUnwrapProperties(model: ConstrainedObjectModel, renderer: JavaScriptRenderer<any>) {
  let unmarshalAdditionalProperties = '';
  let setAdditionalPropertiesMap = '';
  if (model.additionalProperties !== undefined) {
    const modelInstanceVariable = 'value';
    const unmarshalCode = renderUnmarshalProperty(modelInstanceVariable, model);
    setAdditionalPropertiesMap = `if (instance.${additionalPropertyName} === undefined) {instance.${additionalPropertyName} = new Map();}`;
    unmarshalAdditionalProperties = `instance.${additionalPropertyName}.set(key, ${unmarshalCode});`;
  }
  const propertyNames = Object.keys(model.properties).map((prop => `"${prop}"`));
  return `
  //Not part of core properties
  ${setAdditionalPropertiesMap}
  for (const [key, value] of Object.entries(obj).filter((([key,]) => {return ![${propertyNames}].includes(key);}))) {
${renderer.indent(unmarshalAdditionalProperties, 4)}
  }`;
}

/**
 * Render `unmarshal` function based on model
 */
function renderUnmarshal({ renderer, model }: {
  renderer: JavaScriptRenderer<any>,
  model: ConstrainedObjectModel
}): string {
  const properties = model.properties || {};
  const unmarshalProperties = renderUnmarshalProperties(model, renderer);
  return `unmarshal(json){
  const obj = typeof json === "object" ? json : JSON.parse(json);
  const instance = new ${model.name}({});

${renderer.indent(unmarshalProperties)}


  return instance;
}`;
}

/**
 * Preset which adds `marshal`, `unmarshal` functions to class. 
 * 
 * @implements {JavaScriptPreset}
 */
export const JS_COMMON_PRESET: JavaScriptPreset<JavaScriptCommonPresetOptions> = {
  class: {
    additionalContent({ renderer, model, content, options, inputModel }) {
      options = options || {};
      const blocks: string[] = [];

      if (options.marshalling === true) {
        blocks.push(renderMarshal({ renderer, model, inputModel }));
        blocks.push(renderUnmarshal({ renderer, model, inputModel }));
      }
      if (options.example === true) {
        blocks.push(renderExampleFunction({ renderer, model }));
      }
      return renderer.renderBlock([content, ...blocks], 2);
    },
  }
};
