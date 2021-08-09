import { TypeScriptRenderer } from '../TypeScriptRenderer';
import { TypeScriptPreset } from '../TypeScriptPreset';

import { getUniquePropertyName, FormatHelpers, DefaultPropertyNames } from '../../../helpers';
import { CommonModel } from '../../../models';

export interface TypeScriptCommonPresetOptions {
  marshal: boolean;
  unmarshal: boolean;
}

/**
 * Render `marshal` function based on model
 */
function renderMarshal({ renderer, model }: {
  renderer: TypeScriptRenderer,
  model: CommonModel,
}): string {
  const properties = model.properties || {};
  const propertyKeys = [...Object.entries(properties)];
  const marshalProperties = propertyKeys.map(([prop, propModel]) => {
    const camelCasedProp = FormatHelpers.toCamelCase(prop);
    const propMarshalReference = `json += \`"${camelCasedProp}": $\{this.${camelCasedProp}.marshal()},\`;`;
    const propMarshal = `json += \`"${camelCasedProp}": $\{JSON.stringify(this.${camelCasedProp})},\`;`;
    const propMarshalCode = propModel.$ref !== undefined ? propMarshalReference : propMarshal;
    return `if(this.${camelCasedProp} !== undefined) {
  ${propMarshalCode} 
}`;
  }).join('\n');

  let marshalPatternProperties = '';
  if (model.patternProperties !== undefined) {
    for (const [pattern, patternModel] of Object.entries(model.patternProperties)) {
      let patternPropertyName = getUniquePropertyName(model, `${pattern}${DefaultPropertyNames.patternProperties}`);
      patternPropertyName = renderer.nameProperty(patternPropertyName, patternModel);
      marshalPatternProperties += `if(this.${patternPropertyName} !== undefined) { 
  for (const [key, value] of this.${patternPropertyName}.entries()) {
    //Only render pattern properties which are not already a property
    if(Object.keys(this).includes(String(key))) continue;
    ${patternModel.$ref !== undefined ? 'json += `"${key}": ${value.marshal()},`;' : 'json += `"${key}": ${JSON.stringify(value)},`;'}    
  }
}`;
    }
  }  

  let marshalAdditionalProperties = '';
  if (model.additionalProperties !== undefined) {
    let additionalPropertyName = getUniquePropertyName(model, DefaultPropertyNames.additionalProperties);
    additionalPropertyName = renderer.nameProperty(additionalPropertyName, model.additionalProperties);
    marshalAdditionalProperties = `if(this.${additionalPropertyName} !== undefined) { 
  for (const [key, value] of this.${additionalPropertyName}.entries()) {
    //Only render additionalProperties which are not already a property
    if(Object.keys(this).includes(String(key))) continue;
    ${model.additionalProperties.$ref !== undefined ? 'json += `"${key}": ${value.marshal()},`;' : 'json += `"${key}": ${JSON.stringify(value)},`;'}    
  }
}`;
  }
  return `public marshal() : string {
  let json = '{'
${renderer.indent(marshalProperties)}

${renderer.indent(marshalPatternProperties)}

${renderer.indent(marshalAdditionalProperties)}

  //Remove potential last comma 
  return \`$\{json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}\`;
}`;
} 

/**
 * Render `unmarshal` function based on model
 */
function renderUnmarshal({ renderer, model }: {
  renderer: TypeScriptRenderer,
  model: CommonModel,
}): string {
  const properties = model.properties || {};
  const propertyKeys = [...Object.entries(properties)];
  const unmarshalProperties = propertyKeys.map(([prop, propModel]) => {
    const camelCasedProp = FormatHelpers.toCamelCase(prop);
    const propUnmarshal = propModel.$ref !== undefined ? `${renderer.nameType(propModel.$ref)}.unmarshal(obj.${camelCasedProp})` : `obj.${camelCasedProp}`;
    return `if (obj.${camelCasedProp} !== undefined) {
  instance.${camelCasedProp} = ${propUnmarshal};
}`;
  }).join('\n');

  let unmarshalPatternProperties = '';
  if (model.patternProperties !== undefined) {
    for (const [pattern, patternModel] of Object.entries(model.patternProperties)) {
      let patternPropertyName = getUniquePropertyName(model, `${pattern}${DefaultPropertyNames.patternProperties}`);
      patternPropertyName = renderer.nameProperty(patternPropertyName, patternModel);
      unmarshalPatternProperties += `if (key.match(new RegExp('${pattern}'))) {
  if (instance.${patternPropertyName} === undefined) {instance.${patternPropertyName} = new Map();}
  instance.${patternPropertyName}.set(key, value as any);
  continue;
}`;
    }
  }  

  let unmarshalAdditionalProperties = '';
  if (model.additionalProperties !== undefined) {
    let additionalPropertyName = getUniquePropertyName(model, DefaultPropertyNames.additionalProperties);
    additionalPropertyName = renderer.nameProperty(additionalPropertyName, model.additionalProperties);
    const additionalPropertiesCast = model.additionalProperties.$ref !== undefined ? `${renderer.nameType(model.$id)}.unmarshal(value)` : 'value as any';
    unmarshalAdditionalProperties = `if (instance.${additionalPropertyName} === undefined) {instance.${additionalPropertyName} = new Map();}
instance.${additionalPropertyName}.set(key, ${additionalPropertiesCast});`;
  }
  const formattedModelName = renderer.nameType(model.$id);
  const propertyNames = Object.keys(properties).map((prop => `"${prop}"`));
  return `public static unmarshal(json: string | object): ${formattedModelName} {
  const obj = typeof json === "object" ? json : JSON.parse(json);
  const instance = new ${formattedModelName}({});

${renderer.indent(unmarshalProperties)}

  //Not part of core properties
  for (const [key, value] of Object.entries(obj).filter((([key,]) => {return ![${propertyNames}].includes(key);}))) {
    //Check all pattern properties
${renderer.indent(unmarshalPatternProperties, 4)}

${renderer.indent(unmarshalAdditionalProperties, 4)}
  }
  return instance;
}`;
} 

/**
 * Preset which adds `marshal`, `unmarshal` functions to class. 
 * 
 * @implements {TypeScriptPreset}
 */
export const TS_COMMON_PRESET: TypeScriptPreset = {
  class: {
    additionalContent({ renderer, model, content, options }) {
      options = options || {};
      const blocks: string[] = [];
      
      if (options.marshal === undefined || options.marshal === true) {blocks.push(renderMarshal({ renderer, model }));}
      if (options.unmarshal === undefined || options.unmarshal === true) {blocks.push(renderUnmarshal({ renderer, model }));}
      
      return renderer.renderBlock([content, ...blocks], 2);
    },
  }
};
