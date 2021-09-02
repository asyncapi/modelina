import { CSharpRenderer } from '../CSharpRenderer';
import { CSharpPreset } from '../CSharpPreset';
import { getUniquePropertyName, DefaultPropertyNames, FormatHelpers } from '../../../helpers';
import { CommonModel } from '../../../models';

function renderSerializeAdditionalProperties(model: CommonModel, renderer: CSharpRenderer) {
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
    JsonSerializer.Serialize(writer, additionalProperty.Value);
  }
}`;
  }
  return serializeAdditionalProperties;
}

function renderSerializeProperties(model: CommonModel, renderer: CSharpRenderer) {
  let serializeProperties = '';
  if (model.properties !== undefined) {
    for (const [propertyName, propertyModel] of Object.entries(model.properties)) {
      const formattedPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(propertyName, propertyModel));
      serializeProperties += `if(value.${formattedPropertyName} != null) { 
  // write property name and let the serializer serialize the value itself
  writer.WritePropertyName("${propertyName}");
  JsonSerializer.Serialize(writer, value.${formattedPropertyName});
}\n`;
    }
  }
  return serializeProperties;
}
function renderSerializePatternProperties(model: CommonModel, renderer: CSharpRenderer) {
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
    JsonSerializer.Serialize(writer, patternProp.Value);
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
function renderSerialize({ renderer, model }: {
  renderer: CSharpRenderer,
  model: CommonModel,
}): string {
  const formattedModelName = renderer.nameType(model.$id);
  const serializeProperties = renderSerializeProperties(model, renderer);
  const serializePatternProperties = renderSerializePatternProperties(model, renderer);
  const serializeAdditionalProperties = renderSerializeAdditionalProperties(model, renderer);
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

function renderDeserializeProperties(model: CommonModel, renderer: CSharpRenderer) {
  const propertyEntries = Object.entries(model.properties || {});
  const deserializeProperties = propertyEntries.map(([prop, propModel]) => {
    const formattedPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(prop, propModel));
    const propertyModelType = renderer.renderType(propModel);
    return `if (propertyName == "${prop}")
{
  var value = JsonSerializer.Deserialize<${propertyModelType}>(ref reader, options);
  instance.${formattedPropertyName} = value;
  continue;
}`;
  });
  return deserializeProperties.join('\n');
}

function renderDeserializePatternProperties(model: CommonModel, renderer: CSharpRenderer) {
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
  var deserializedValue = JsonSerializer.Deserialize<${patternPropertyType}>(ref reader, options);
  instance.${patternPropertyName}.Add(propertyName, deserializedValue);
  continue;
}`;
  });
  return patternProperties.join('\n');
}

function renderDeserializeAdditionalProperties(model: CommonModel, renderer: CSharpRenderer) {
  if (model.additionalProperties === undefined) {
    return ''; 
  }
  let additionalPropertyName = getUniquePropertyName(model, DefaultPropertyNames.additionalProperties);
  additionalPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(additionalPropertyName, model.additionalProperties));
  const additionalPropertyType = renderer.renderType(model.additionalProperties);
  return `if(instance.${additionalPropertyName} == null) { instance.${additionalPropertyName} = new Dictionary<string, ${additionalPropertyType}>(); }
var deserializedValue = JsonSerializer.Deserialize<${additionalPropertyType}>(ref reader, options);
instance.${additionalPropertyName}.Add(propertyName, deserializedValue);
continue;`;
}

/**
 * Render `deserialize` function based on model
 */
function renderDeserialize({ renderer, model }: {
  renderer: CSharpRenderer,
  model: CommonModel,
}): string {
  const formattedModelName = renderer.nameType(model.$id);
  const deserializeProperties = renderDeserializeProperties(model, renderer);
  const deserializePatternProperties = renderDeserializePatternProperties(model, renderer);
  const deserializeAdditionalProperties = renderDeserializeAdditionalProperties(model, renderer);
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
    self({ renderer, model, content }) {
      renderer.addDependency('using System.Text.Json;');
      renderer.addDependency('using System.Text.Json.Serialization;');
      renderer.addDependency('using System.Text.RegularExpressions;');
      
      const formattedModelName = renderer.nameType(model.$id);
      const deserialize = renderDeserialize({renderer, model});
      const serialize = renderSerialize({renderer, model});

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
