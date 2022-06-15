import { CSharpRenderer } from '../CSharpRenderer';
import { CSharpPreset } from '../CSharpPreset';
import { getUniquePropertyName, DefaultPropertyNames, FormatHelpers, TypeHelpers, ModelKind } from '../../../helpers';
import { CommonInputModel, CommonModel, ConstrainedDictionaryModel, ConstrainedEnumModel, ConstrainedObjectModel, ConstrainedObjectPropertyModel, ConstrainedReferenceModel, ConstrainedStringModel, DictionaryModel, InputMetaModel } from '../../../models';

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
      const modelInstanceVariable = `value.${formattedPropertyName}`;
      serializeProperties += `if(${modelInstanceVariable} != null) { 
  // write property name and let the serializer serialize the value itself
  writer.WritePropertyName("${propertyName}");
  ${renderSerializeProperty(modelInstanceVariable, propertyModel, inputModel)}
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

function renderDeserializeProperty(model: ConstrainedObjectPropertyModel) {
  //Referenced enums is the only one who need custom serialization
  if (model.property instanceof ConstrainedReferenceModel && 
    model.property.ref instanceof ConstrainedEnumModel) {
    return `${model.property.type}Extension.To${model.property.type}(JsonSerializer.Deserialize<dynamic>(ref reader, options))`;
  }
  return `JsonSerializer.Deserialize<${model.property.type}>(ref reader, options)`;
}

function renderDeserializeProperties(model: ConstrainedObjectModel) {
  const propertyEntries = Object.entries(model.properties || {});
  const deserializeProperties = propertyEntries.map(([prop, propModel]) => {
    //Unwrapped dictionary properties, need to be unwrapped in JSON
    if (propModel.property instanceof ConstrainedDictionaryModel && 
      propModel.property.serializationType === 'unwrap') {
      const dictionaryProperty = propModel.property as ConstrainedDictionaryModel;
      if (dictionaryProperty.key instanceof ConstrainedStringModel && 
        dictionaryProperty.key.originalInput['format'] &&) {
        return `if(instance.${prop} == null) { instance.${prop} = new Dictionary<${dictionaryProperty.key.type}, ${dictionaryProperty.key.type}>(); }
        var match = Regex.Match(propertyName, @"${pattern}");
        if (match.Success)
        {
          var deserializedValue = ${renderDeserializeProperty(propModel)};
          instance.${prop}.Add(propertyName, deserializedValue);
          continue;
        }`;
      }
      return `if(instance.${prop} == null) { instance.${prop} = new Dictionary<${dictionaryProperty.key.type}, ${dictionaryProperty.key.type}>(); }
      var deserializedValue = ${renderDeserializeProperty(propModel)};
      instance.${prop}.Add(propertyName, deserializedValue);
      continue;`;
    } 
    return `if (propertyName == "${prop}")
  {
    var value = ${renderDeserializeProperty(propModel)};
    instance.${prop} = value;
    continue;
  }`;
  });
  return deserializeProperties.join('\n');
}

/**
 * Render `deserialize` function based on model
 */
function renderDeserialize({ renderer, model, inputModel }: {
  renderer: CSharpRenderer<any>,
  model: ConstrainedObjectModel,
  inputModel: InputMetaModel
}): string {
  const deserializeProperties = renderDeserializeProperties(model);
  const deserializePatternProperties = renderDeserializePatternProperties(model, renderer, inputModel);
  const deserializeAdditionalProperties = renderDeserializeAdditionalProperties(model, renderer, inputModel);
  return `public override ${model.name} Read(ref Utf8JsonReader reader, System.Type typeToConvert, JsonSerializerOptions options)
{
  if (reader.TokenType != JsonTokenType.StartObject)
  {
    throw new JsonException();
  }

  var instance = new ${model.name}();
  
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
      
      const deserialize = renderDeserialize({renderer, model, inputModel});
      const serialize = renderSerialize({renderer, model, inputModel});

      return `[JsonConverter(typeof(${model.name}Converter))]
${content}

internal class ${model.name}Converter : JsonConverter<${model.name}>
{
  public override bool CanConvert(System.Type objectType)
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
