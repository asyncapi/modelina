import { JavaScriptRenderer } from '../JavaScriptRenderer';
import { JavaScriptPreset } from '../JavaScriptPreset';
import { getUniquePropertyName, DefaultPropertyNames, TypeHelpers, ModelKind } from '../../../helpers';
import { CommonInputModel, CommonModel } from '../../../models';
import renderExampleFunction from './utils/ExampleFunction';

export interface JavaScriptCommonPresetOptions {
  marshalling: boolean;
  example: boolean;
}

function realizePropertyFactory(prop: string) {
  return `$\{typeof ${prop} === 'number' || typeof ${prop} === 'boolean' ? ${prop} : JSON.stringify(${prop})}`;
}
function renderMarshalProperty(modelInstanceVariable: string, model: CommonModel, inputModel: CommonInputModel) {
  if (model.$ref) {
    const resolvedModel = inputModel.models[model.$ref];
    const propertyModelKind = TypeHelpers.extractKind(resolvedModel);
    //Referenced enums only need standard marshalling, so lets filter those away
    if (propertyModelKind !== ModelKind.ENUM) {
      return `$\{${modelInstanceVariable}.marshal()}`;
    }
  }
  return realizePropertyFactory(modelInstanceVariable);
}
function renderMarshalProperties(model: CommonModel, renderer: JavaScriptRenderer, inputModel: CommonInputModel) {
  const properties = model.properties || {};
  const propertyKeys = [...Object.entries(properties)];
  const marshalProperties = propertyKeys.map(([prop, propModel]) => {
    const formattedPropertyName = renderer.nameProperty(prop, propModel);
    const modelInstanceVariable = `this.${formattedPropertyName}`;
    const propMarshalCode = renderMarshalProperty(modelInstanceVariable, propModel, inputModel);
    const marshalCode = `json += \`"${prop}": ${propMarshalCode},\`;`;
    return `if(${modelInstanceVariable} !== undefined) {
  ${marshalCode} 
}`;
  });
  return marshalProperties.join('\n');
}

function renderMarshalPatternProperties(model: CommonModel, renderer: JavaScriptRenderer, inputModel: CommonInputModel) {
  let marshalPatternProperties = '';
  if (model.patternProperties !== undefined) {
    for (const [pattern, patternModel] of Object.entries(model.patternProperties)) {
      let patternPropertyName = getUniquePropertyName(model, `${pattern}${DefaultPropertyNames.patternProperties}`);
      patternPropertyName = renderer.nameProperty(patternPropertyName, patternModel);
      const modelInstanceVariable = 'value';
      const patternPropertyMarshalCode = renderMarshalProperty(modelInstanceVariable, patternModel, inputModel);
      const marshalCode = `json += \`"$\{key}": ${patternPropertyMarshalCode},\`;`;
      marshalPatternProperties += `if(this.${patternPropertyName} !== undefined) { 
  for (const [key, value] of this.${patternPropertyName}.entries()) {
    //Only render pattern properties which are not already a property
    if(Object.keys(this).includes(String(key))) continue;
    ${marshalCode}
  }
}`;
    }
  }
  return marshalPatternProperties;
}

function renderMarshalAdditionalProperties(model: CommonModel, renderer: JavaScriptRenderer, inputModel: CommonInputModel) {
  let marshalAdditionalProperties = '';
  if (model.additionalProperties !== undefined) {
    let additionalPropertyName = getUniquePropertyName(model, DefaultPropertyNames.additionalProperties);
    additionalPropertyName = renderer.nameProperty(additionalPropertyName, model.additionalProperties);
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
function renderMarshal({ renderer, model, inputModel }: {
  renderer: JavaScriptRenderer,
  model: CommonModel,
  inputModel: CommonInputModel
}): string {
  return `marshal(){
  let json = '{'
${renderer.indent(renderMarshalProperties(model, renderer, inputModel))}
${renderer.indent(renderMarshalPatternProperties(model, renderer, inputModel))}
${renderer.indent(renderMarshalAdditionalProperties(model, renderer, inputModel))}

  //Remove potential last comma 
  return \`$\{json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}\`;
}`;
}

function renderUnmarshalProperty(modelInstanceVariable: string, model: CommonModel, inputModel: CommonInputModel, renderer: JavaScriptRenderer) {
  if (model.$ref) {
    const resolvedModel = inputModel.models[model.$ref];
    const propertyModelKind = TypeHelpers.extractKind(resolvedModel);
    //Referenced enums only need standard marshalling, so lets filter those away
    if (propertyModelKind !== ModelKind.ENUM) {
      return `${renderer.nameType(model.$ref)}.unmarshal(${modelInstanceVariable})`;
    }
  }
  return `${modelInstanceVariable}`;
}
function renderUnmarshalProperties(model: CommonModel, renderer: JavaScriptRenderer, inputModel: CommonInputModel) {
  const properties = model.properties || {};
  const propertyKeys = [...Object.entries(properties)];
  const unmarshalProperties = propertyKeys.map(([prop, propModel]) => {
    const formattedPropertyName = renderer.nameProperty(prop, propModel);
    const modelInstanceVariable = `obj["${prop}"]`;
    const unmarshalCode = renderUnmarshalProperty(modelInstanceVariable, propModel, inputModel, renderer);
    return `if (${modelInstanceVariable} !== undefined) {
  instance.${formattedPropertyName} = ${unmarshalCode};
}`;
  });
  return unmarshalProperties.join('\n');
}

function renderUnmarshalPatternProperties(model: CommonModel, renderer: JavaScriptRenderer, inputModel: CommonInputModel) {
  let unmarshalPatternProperties = '';
  let setPatternPropertiesMap = '';
  if (model.patternProperties !== undefined) {
    for (const [pattern, patternModel] of Object.entries(model.patternProperties)) {
      let patternPropertyName = getUniquePropertyName(model, `${pattern}${DefaultPropertyNames.patternProperties}`);
      patternPropertyName = renderer.nameProperty(patternPropertyName, patternModel);
      const modelInstanceVariable = 'value';
      const unmarshalCode = renderUnmarshalProperty(modelInstanceVariable, patternModel, inputModel, renderer);
      setPatternPropertiesMap += `if (instance.${patternPropertyName} === undefined) {instance.${patternPropertyName} = new Map();}\n`;
      unmarshalPatternProperties += `//Check all pattern properties
if (key.match(new RegExp('${pattern}'))) {
  instance.${patternPropertyName}.set(key, ${unmarshalCode});
  continue;
}`;
    }
  }
  return { unmarshalPatternProperties, setPatternPropertiesMap };
}

function renderUnmarshalAdditionalProperties(model: CommonModel, renderer: JavaScriptRenderer, inputModel: CommonInputModel) {
  let unmarshalAdditionalProperties = '';
  let setAdditionalPropertiesMap = '';
  if (model.additionalProperties !== undefined) {
    let additionalPropertyName = getUniquePropertyName(model, DefaultPropertyNames.additionalProperties);
    additionalPropertyName = renderer.nameProperty(additionalPropertyName, model.additionalProperties);
    const modelInstanceVariable = 'value';
    const unmarshalCode = renderUnmarshalProperty(modelInstanceVariable, model.additionalProperties, inputModel, renderer);
    setAdditionalPropertiesMap = `if (instance.${additionalPropertyName} === undefined) {instance.${additionalPropertyName} = new Map();}`;
    unmarshalAdditionalProperties = `instance.${additionalPropertyName}.set(key, ${unmarshalCode});`;
  }
  return { unmarshalAdditionalProperties, setAdditionalPropertiesMap };
}

/**
 * Render `unmarshal` function based on model
 */
function renderUnmarshal({ renderer, model, inputModel }: {
  renderer: JavaScriptRenderer,
  model: CommonModel,
  inputModel: CommonInputModel
}): string {
  const properties = model.properties || {};
  const { unmarshalPatternProperties, setPatternPropertiesMap } = renderUnmarshalPatternProperties(model, renderer, inputModel);
  const { unmarshalAdditionalProperties, setAdditionalPropertiesMap } = renderUnmarshalAdditionalProperties(model, renderer, inputModel);
  const unmarshalProperties = renderUnmarshalProperties(model, renderer, inputModel);
  const formattedModelName = renderer.nameType(model.$id);
  const propertyNames = Object.keys(properties).map((prop => `"${prop}"`));
  return `unmarshal(json){
  const obj = typeof json === "object" ? json : JSON.parse(json);
  const instance = new ${formattedModelName}({});

${renderer.indent(unmarshalProperties)}

  //Not part of core properties
  ${setPatternPropertiesMap}
  ${setAdditionalPropertiesMap}
  for (const [key, value] of Object.entries(obj).filter((([key,]) => {return ![${propertyNames}].includes(key);}))) {
${renderer.indent(unmarshalPatternProperties, 4)}
${renderer.indent(unmarshalAdditionalProperties, 4)}
  }
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
