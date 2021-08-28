import { CSharpRenderer } from '../CSharpRenderer';
import { CSharpPreset } from '../CSharpPreset';
import { getUniquePropertyName, DefaultPropertyNames } from '../../../helpers';
import { CommonModel } from '../../../models';
import { FormatHelpers } from '../../../helpers';

function renderMarshalAdditionalProperties(model: CommonModel, renderer: CSharpRenderer) {
  const marshalAdditionalProperties = '';
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
  return marshalAdditionalProperties;
}

function renderMarshalProperties(model: CommonModel, renderer: CSharpRenderer) {
  let marshalProperties = '';
  if (model.properties !== undefined) {
    for (const [propertyName, propertyModel] of Object.entries(model.properties)) {
      const formattedPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(propertyName, propertyModel));
      marshalProperties += `if(value.${formattedPropertyName} != null) { 
  // write property name and let the serializer serialize the value itself
  writer.WritePropertyName("${propertyName}");
  JsonSerializer.Serialize(writer, value.${formattedPropertyName});
}\n`;
    }
  }
  return marshalProperties;
}
function renderMarshalPatternProperties(model: CommonModel, renderer: CSharpRenderer) {
  let marshalPatternProperties = '';
  if (model.patternProperties !== undefined) {
    for (const [pattern, patternModel] of Object.entries(model.patternProperties)) {
      let patternPropertyName = getUniquePropertyName(model, `${pattern}${DefaultPropertyNames.patternProperties}`);
      patternPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(patternPropertyName, patternModel));
      marshalPatternProperties += `// Unwrap pattern properties in object
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
  return marshalPatternProperties;
}
/**
 * Render `marshal` function based on model
 */
function renderMarshal({ renderer, model }: {
  renderer: CSharpRenderer,
  model: CommonModel,
}): string {
  const formattedModelName = renderer.nameType(model.$id);
  const marshalProperties = renderMarshalProperties(model, renderer);
  const marshalPatternProperties = renderMarshalPatternProperties(model, renderer);
  const marshalAdditionalProperties = renderMarshalAdditionalProperties(model, renderer);
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
  return `public override void Write(Utf8JsonWriter writer, ${formattedModelName} value, JsonSerializerOptions options)
{
  if (value == null)
  {
    JsonSerializer.Serialize(writer, null);
    return;
  }
  ${propertyFilter.length === 0 ? 'var properties = value.GetType().GetProperties();': `var properties = value.GetType().GetProperties().Where(prop => ${propertyFilter.join(' && ')});`}
  
  writer.WriteStartObject();

${renderer.indent(marshalProperties)}

${renderer.indent(marshalPatternProperties)}

${renderer.indent(marshalAdditionalProperties)}

  writer.WriteEndObject();
}`;
} 

function renderUnmarshalProperties(model: CommonModel, renderer: CSharpRenderer) {
  const propertyEntries = Object.entries(model.properties || {});
  const unmarshalProperties = propertyEntries.map(([prop, propModel]) => {
    const formattedPropertyName = FormatHelpers.upperFirst(renderer.nameProperty(prop, propModel));
    const propertyModelType = renderer.renderType(propModel);
    return `if (propertyName == "${prop}")
{
  var value = JsonSerializer.Deserialize<${propertyModelType}>(ref reader, options);
  instance.${formattedPropertyName} = value;
  continue;
}`;
  });
  return unmarshalProperties.join('\n');
}

function renderUnmarshalPatternProperties(model: CommonModel, renderer: CSharpRenderer) {
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

function renderUnmarshalAdditionalProperties(model: CommonModel, renderer: CSharpRenderer) {
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
 * Render `unmarshal` function based on model
 */
function renderUnmarshal({ renderer, model }: {
  renderer: CSharpRenderer,
  model: CommonModel,
}): string {
  const formattedModelName = renderer.nameType(model.$id);
  const unmarshalProperties = renderUnmarshalProperties(model, renderer);
  const unmarshalPatternProperties = renderUnmarshalPatternProperties(model, renderer);
  const unmarshalAdditionalProperties = renderUnmarshalAdditionalProperties(model, renderer);
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
${renderer.indent(unmarshalProperties, 4)}

${renderer.indent(unmarshalPatternProperties, 4)}

${renderer.indent(unmarshalAdditionalProperties, 4)}
  }
  
  throw new JsonException();
}`;
} 

/**
 * Preset which adds `marshal` and `unmarshal` functions to class. 
 * 
 * @implements {CSharpPreset}
 */
export const CSHARP_JSON_SERIALIZER_PRESET: CSharpPreset = {
  class: {
    async self({ renderer, model}) {
      renderer.addDependency('using System.Text.Json;');
      renderer.addDependency('using System.Text.Json.Serialization;');
      renderer.addDependency('using System.Text.RegularExpressions;');
      renderer.addDependency('using System.Linq;');
      
      const formattedModelName = renderer.nameType(model.$id);
      const unmarshal = renderUnmarshal({renderer, model});
      const marshal = renderMarshal({renderer, model});

      return `[JsonConverter(typeof(${formattedModelName}Converter))]
${await renderer.defaultSelf()}

internal class ${formattedModelName}Converter : JsonConverter<${formattedModelName}>
{
  public override bool CanConvert(Type objectType)
  {
    // this converter can be applied to any type
    return true;
  }
${renderer.indent(unmarshal)}
${renderer.indent(marshal)}

}
`;
    }
  }
};
