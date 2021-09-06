import { CSharpRenderer } from '../CSharpRenderer';
import { CSharpPreset } from '../CSharpPreset';
import { getUniquePropertyName, DefaultPropertyNames, FormatHelpers, TypeHelpers, ModelKind } from '../../../helpers';
import { CommonInputModel, CommonModel } from '../../../models';

function renderSerializeProperty(modelInstanceVariable: string, model: CommonModel, inputModel: CommonInputModel) {
  let value = modelInstanceVariable;
  if (model.$ref) {
    const resolvedModel = inputModel.models[model.$ref];
    const propertyModelKind = TypeHelpers.extractKind(resolvedModel);
    //Referenced enums is the only one who need custom serialization
    if (propertyModelKind === ModelKind.ENUM) {
      value = `${value}.GetValue()`;
    }
  }
  return `JsonSerializer.Serialize(writer, ${value});`;
}

function renderSerializeAdditionalProperties(model: CommonModel, renderer: CSharpRenderer, inputModel: CommonInputModel) {
  const serializeAdditionalProperties = '';
  if (model.additionalProperties !== undefined) {
    let additionalPropertyName = getUniquePropertyName(model, DefaultPropertyNames.additionalProperties);
    additionalPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(additionalPropertyName, model.additionalProperties));
    return `// Unwrap additional properties in object
if (value.AdditionalProperties != null) {
  foreach (var additionalProperty in value.${additionalPropertyName})
  {
    //Ignore any additional properties which might already be part of the core properties
    if (properties.Any(prop => prop.Name == additionalProperty.Key))
    {
        continue;
    }
    // write property name and let the serializer serialize the value itself
    writer.WritePropertyName(additionalProperty.Key);
    ${renderSerializeProperty('additionalProperty.Value', model.additionalProperties, inputModel)}
  }
}`;
  }
  return serializeAdditionalProperties;
}

function renderSerializeProperties(model: CommonModel, renderer: CSharpRenderer, inputModel: CommonInputModel) {
  let serializeProperties = '';
  if (model.properties !== undefined) {
    for (const [propertyName, propertyModel] of Object.entries(model.properties)) {
      const formattedPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(propertyName, propertyModel));
      serializeProperties += `if(value.${formattedPropertyName} != null) { 
  // write property name and let the serializer serialize the value itself
  writer.WritePropertyName("${propertyName}");
  ${renderSerializeProperty(`value.${formattedPropertyName}`, propertyModel, inputModel)}
}\n`;
    }
  }
  return serializeProperties;
}
function renderSerializePatternProperties(model: CommonModel, renderer: CSharpRenderer, inputModel: CommonInputModel) {
  let serializePatternProperties = '';
  if (model.patternProperties !== undefined) {
    for (const [pattern, patternModel] of Object.entries(model.patternProperties)) {
      let patternPropertyName = getUniquePropertyName(model, `${pattern}${DefaultPropertyNames.patternProperties}`);
      patternPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(patternPropertyName, patternModel));
      serializePatternProperties += `// Unwrap pattern properties in object
if(value.${patternPropertyName} != null) { 
  foreach (var patternProp in value.${patternPropertyName})
  {
    //Ignore any pattern properties which might already be part of the core properties
    if (properties.Any(prop => prop.Name == patternProp.Key))
    {
        continue;
    }
    // write property name and let the serializer serialize the value itself
    writer.WritePropertyName(patternProp.Key);
    ${renderSerializeProperty('patternProp.Value', patternModel, inputModel)}
  }
}`;
    }
  }
  return serializePatternProperties;
}

function renderPropertiesList(model: CommonModel, renderer: CSharpRenderer) {
  const propertyFilter: string[] = [];
  if (model.additionalProperties !== undefined) {
    let additionalPropertyName = getUniquePropertyName(model, DefaultPropertyNames.additionalProperties);
    additionalPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(additionalPropertyName, model.additionalProperties));
    propertyFilter.push(`prop.Name != "${additionalPropertyName}"`);
  }
  for (const [pattern, patternModel] of Object.entries(model.patternProperties || {})) {
    let patternPropertyName = getUniquePropertyName(model, `${pattern}${DefaultPropertyNames.patternProperties}`);
    patternPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(patternPropertyName, patternModel));
    propertyFilter.push(`prop.Name != "${patternPropertyName}"`);
  }
  let propertiesList = 'var properties = value.GetType().GetProperties();';
  if (propertyFilter.length > 0) {
    renderer.addDependency('using System.Linq;');
    propertiesList = `var properties = value.GetType().GetProperties().Where(prop => ${propertyFilter.join(' && ')});`;
  }
  return propertiesList;
}
/**
 * Render `serialize` function based on model
 */
function renderSerialize({ renderer, model, inputModel }: {
  renderer: CSharpRenderer,
  model: CommonModel,
  inputModel: CommonInputModel
}): string {
  const formattedModelName = renderer.nameType(model.$id);
  const serializeProperties = renderSerializeProperties(model, renderer, inputModel);
  const serializePatternProperties = renderSerializePatternProperties(model, renderer, inputModel);
  const serializeAdditionalProperties = renderSerializeAdditionalProperties(model, renderer, inputModel);
  const propertiesList = renderPropertiesList(model, renderer);

  return `public override void Write(Utf8JsonWriter writer, ${formattedModelName} value, JsonSerializerOptions options)
{
  if (value == null)
  {
    JsonSerializer.Serialize(writer, null);
    return;
  }
  ${propertiesList}
  
  writer.WriteStartObject();

${renderer.indent(serializeProperties)}

${renderer.indent(serializePatternProperties)}

${renderer.indent(serializeAdditionalProperties)}

  writer.WriteEndObject();
}`;
} 

function renderDeserializeProperty(type: string, model: CommonModel, inputModel: CommonInputModel) {
  if (model.$ref) {
    const resolvedModel = inputModel.models[model.$ref];
    const propertyModelKind = TypeHelpers.extractKind(resolvedModel);
    //Referenced enums is the only one who need custom serialization
    if (propertyModelKind === ModelKind.ENUM) {
      return `${type}Extension.to${type}(JsonSerializer.Deserialize<dynamic>(ref reader, options))`;
    }
  }
  return `JsonSerializer.Deserialize<${type}>(ref reader, options)`;
}

function renderDeserializeProperties(model: CommonModel, renderer: CSharpRenderer, inputModel: CommonInputModel) {
  const propertyEntries = Object.entries(model.properties || {});
  const deserializeProperties = propertyEntries.map(([prop, propModel]) => {
    const formattedPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(prop, propModel));
    const propertyModelType = renderer.renderType(propModel);
    return `if (propertyName == "${prop}")
{
  var value = ${renderDeserializeProperty(propertyModelType, model, inputModel)};
  instance.${formattedPropertyName} = value;
  continue;
}`;
  });
  return deserializeProperties.join('\n');
}

function renderDeserializePatternProperties(model: CommonModel, renderer: CSharpRenderer, inputModel: CommonInputModel) {
  if (model.patternProperties === undefined) {
    return '';
  }
  const patternProperties = Object.entries(model.patternProperties).map(([pattern, patternModel]) => {
    let patternPropertyName = getUniquePropertyName(model, `${pattern}${DefaultPropertyNames.patternProperties}`);
    patternPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(patternPropertyName, patternModel));
    const patternPropertyType = renderer.renderType(patternModel);
    return `if(instance.${patternPropertyName} == null) { instance.${patternPropertyName} = new Dictionary<string, ${patternPropertyType}>(); }
var match = Regex.Match(propertyName, @"${pattern}");
if (match.Success)
{
  var deserializedValue = ${renderDeserializeProperty(patternPropertyType, model, inputModel)};
  instance.${patternPropertyName}.Add(propertyName, deserializedValue);
  continue;
}`;
  });
  return patternProperties.join('\n');
}

function renderDeserializeAdditionalProperties(model: CommonModel, renderer: CSharpRenderer, inputModel: CommonInputModel) {
  if (model.additionalProperties === undefined) {
    return ''; 
  }
  let additionalPropertyName = getUniquePropertyName(model, DefaultPropertyNames.additionalProperties);
  additionalPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(additionalPropertyName, model.additionalProperties));
  const additionalPropertyType = renderer.renderType(model.additionalProperties);
  return `if(instance.${additionalPropertyName} == null) { instance.${additionalPropertyName} = new Dictionary<string, ${additionalPropertyType}>(); }
var deserializedValue = ${renderDeserializeProperty(additionalPropertyType, model, inputModel)};
instance.${additionalPropertyName}.Add(propertyName, deserializedValue);
continue;`;
}

/**
 * Render `deserialize` function based on model
 */
function renderDeserialize({ renderer, model, inputModel }: {
  renderer: CSharpRenderer,
  model: CommonModel,
  inputModel: CommonInputModel
}): string {
  const formattedModelName = renderer.nameType(model.$id);
  const deserializeProperties = renderDeserializeProperties(model, renderer, inputModel);
  const deserializePatternProperties = renderDeserializePatternProperties(model, renderer, inputModel);
  const deserializeAdditionalProperties = renderDeserializeAdditionalProperties(model, renderer, inputModel);
  return `public override ${formattedModelName} Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
{
  if (reader.TokenType != JsonTokenType.StartObject)
  {
    throw new JsonException();
  }

  var instance = new ${formattedModelName}();
  
  while (reader.Read())
  {
    if (reader.TokenType == JsonTokenType.EndObject)
    {
      return instance;
    }

    // Get the key.
    if (reader.TokenType != JsonTokenType.PropertyName)
    {
      throw new JsonException();
    }

    string propertyName = reader.GetString();
${renderer.indent(deserializeProperties, 4)}

${renderer.indent(deserializePatternProperties, 4)}

${renderer.indent(deserializeAdditionalProperties, 4)}
  }
  
  throw new JsonException();
}`;
} 

/**
 * Preset which adds `serialize` and `deserialize` functions to class. 
 * 
 * @implements {CSharpPreset}
 */
export const CSHARP_JSON_SERIALIZER_PRESET: CSharpPreset = {
  class: {
    self({ renderer, model, content, inputModel}) {
      renderer.addDependency('using System.Text.Json;');
      renderer.addDependency('using System.Text.Json.Serialization;');
      renderer.addDependency('using System.Text.RegularExpressions;');
      
      const formattedModelName = renderer.nameType(model.$id);
      const deserialize = renderDeserialize({renderer, model, inputModel});
      const serialize = renderSerialize({renderer, model, inputModel});

      return `[JsonConverter(typeof(${formattedModelName}Converter))]
${content}

internal class ${formattedModelName}Converter : JsonConverter<${formattedModelName}>
{
  public override bool CanConvert(Type objectType)
  {
    // this converter can be applied to any type
    return true;
  }
${renderer.indent(deserialize)}
${renderer.indent(serialize)}

}
`;
    }
  }
};
