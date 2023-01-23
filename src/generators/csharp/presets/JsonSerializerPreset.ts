import { CSharpRenderer } from '../CSharpRenderer';
import { CSharpPreset } from '../CSharpPreset';
import {
  ConstrainedDictionaryModel,
  ConstrainedEnumModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel
} from '../../../models';
import { CSharpOptions } from '../CSharpGenerator';

function renderSerializeProperty(
  modelInstanceVariable: string,
  model: ConstrainedObjectPropertyModel
) {
  let value = modelInstanceVariable;
  //Special case where a referenced enum model need to be accessed
  if (
    model.property instanceof ConstrainedReferenceModel &&
    model.property.ref instanceof ConstrainedEnumModel
  ) {
    value = `${model.property.type}.GetValue()`;
  }
  return `JsonSerializer.Serialize(writer, ${value}, options);`;
}

function renderSerializeProperties(model: ConstrainedObjectModel) {
  let serializeProperties = '';
  if (model.properties !== undefined) {
    for (const [propertyName, propertyModel] of Object.entries(
      model.properties
    )) {
      const modelInstanceVariable = `value.${propertyName}`;
      if (
        propertyModel.property instanceof ConstrainedDictionaryModel &&
        propertyModel.property.serializationType === 'unwrap'
      ) {
        serializeProperties += `// Unwrap dictionary properties
if (${modelInstanceVariable} != null) {
  foreach (var unwrappedProperty in ${modelInstanceVariable})
  {
    // Ignore any unwrapped properties which might already be part of the core properties
    if (properties.Any(prop => prop.Name == unwrappedProperty.Key))
    {
        continue;
    }
    // Write property name and let the serializer serialize the value itself
    writer.WritePropertyName(unwrappedProperty.Key);
    ${renderSerializeProperty('unwrappedProperty.Value', propertyModel)}
  }
}`;
      }
      serializeProperties += `if(${modelInstanceVariable} != null) { 
  // write property name and let the serializer serialize the value itself
  writer.WritePropertyName("${propertyModel.unconstrainedPropertyName}");
  ${renderSerializeProperty(modelInstanceVariable, propertyModel)}
}\n`;
    }
  }
  return serializeProperties;
}

function renderPropertiesList(
  model: ConstrainedObjectModel,
  renderer: CSharpRenderer<any>
) {
  const unwrappedDictionaryProperties = Object.values(model.properties)
    .filter((model) => {
      return (
        model.property instanceof ConstrainedDictionaryModel &&
        model.property.serializationType === 'unwrap'
      );
    })
    .map((value) => {
      return value.propertyName;
    });

  let propertiesList = 'var properties = value.GetType().GetProperties();';
  if (unwrappedDictionaryProperties.length > 0) {
    renderer.dependencyManager.addDependency('using System.Linq;');
    propertiesList = `var properties = value.GetType().GetProperties().Where(prop => ${unwrappedDictionaryProperties.join(
      ' && '
    )});`;
  }
  return propertiesList;
}
/**
 * Render `serialize` function based on model
 */
function renderSerialize({
  renderer,
  model
}: {
  renderer: CSharpRenderer<any>;
  model: ConstrainedObjectModel;
}): string {
  const serializeProperties = renderSerializeProperties(model);
  const propertiesList = renderPropertiesList(model, renderer);

  return `public override void Write(Utf8JsonWriter writer, ${
    model.name
  } value, JsonSerializerOptions options)
{
  if (value == null)
  {
    JsonSerializer.Serialize(writer, null, options);
    return;
  }
  ${propertiesList}
  
  writer.WriteStartObject();

${renderer.indent(serializeProperties)}

  writer.WriteEndObject();
}`;
}

function renderDeserializeProperty(model: ConstrainedObjectPropertyModel) {
  //Referenced enums is the only one who need custom serialization
  if (
    model.property instanceof ConstrainedReferenceModel &&
    model.property.ref instanceof ConstrainedEnumModel
  ) {
    return `${model.property.name}Extension.To${model.property.name}(JsonSerializer.Deserialize<dynamic>(ref reader, options))`;
  }
  return `JsonSerializer.Deserialize<${model.property.type}>(ref reader, options)`;
}

function renderDeserializeProperties(model: ConstrainedObjectModel) {
  const propertyEntries = Object.entries(model.properties || {});
  const deserializeProperties = propertyEntries.map(([prop, propModel]) => {
    //Unwrapped dictionary properties, need to be unwrapped in JSON
    if (
      propModel.property instanceof ConstrainedDictionaryModel &&
      propModel.property.serializationType === 'unwrap'
    ) {
      return `if(instance.${prop} == null) { instance.${prop} = new Dictionary<${
        propModel.property.key.type
      }, ${propModel.property.key.type}>(); }
      var deserializedValue = ${renderDeserializeProperty(propModel)};
      instance.${prop}.Add(propertyName, deserializedValue);
      continue;`;
    }
    return `if (propertyName == "${propModel.unconstrainedPropertyName}")
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
function renderDeserialize({
  renderer,
  model
}: {
  renderer: CSharpRenderer<any>;
  model: ConstrainedObjectModel;
}): string {
  const deserializeProperties = renderDeserializeProperties(model);
  return `public override ${
    model.name
  } Read(ref Utf8JsonReader reader, System.Type typeToConvert, JsonSerializerOptions options)
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
  }
  
  throw new JsonException();
}`;
}

/**
 * Preset which adds `serialize` and `deserialize` functions to class.
 *
 * @implements {CSharpPreset}
 */
export const CSHARP_JSON_SERIALIZER_PRESET: CSharpPreset<CSharpOptions> = {
  class: {
    self({ renderer, model, content }) {
      renderer.dependencyManager.addDependency('using System.Text.Json;');
      renderer.dependencyManager.addDependency(
        'using System.Text.Json.Serialization;'
      );
      renderer.dependencyManager.addDependency(
        'using System.Text.RegularExpressions;'
      );

      const deserialize = renderDeserialize({ renderer, model });
      const serialize = renderSerialize({ renderer, model });

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
