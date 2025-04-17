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
import { pascalCase } from 'change-case';

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
    value = `${modelInstanceVariable}${model.required ? '' : '?'}.GetValue()`;
  }
  return `JsonSerializer.Serialize(writer, ${value}, options);`;
}

function renderSerializeProperties(model: ConstrainedObjectModel) {
  let serializeProperties = '';
  if (model.properties !== undefined) {
    for (const [propertyName, propertyModel] of Object.entries(
      model.properties
    )) {
      const modelInstanceVariable = `value.${pascalCase(propertyName)}`;
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
      } else {
        serializeProperties += `if(${modelInstanceVariable} != null) {
  // write property name and let the serializer serialize the value itself
  writer.WritePropertyName("${propertyModel.unconstrainedPropertyName}");
  ${renderSerializeProperty(modelInstanceVariable, propertyModel)}
}\n`;
      }
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
      return `prop.Name != "${pascalCase(value.propertyName)}"`;
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
    return `${model.property.name}Extensions.To${model.property.name}(JsonSerializer.Deserialize<dynamic>(ref reader, options))`;
  }
  return `JsonSerializer.Deserialize<${model.property.type}>(ref reader, options)`;
}

function renderDeserializeProperties(model: ConstrainedObjectModel) {
  const propertyEntries = Object.entries(model.properties || {});
  const deserializeProperties = propertyEntries
    .map(([prop, propModel]) => {
      const pascalProp = pascalCase(prop);
      //Unwrapped dictionary properties, need to be unwrapped in JSON
      if (
        propModel.property instanceof ConstrainedDictionaryModel &&
        propModel.property.serializationType === 'unwrap'
      ) {
        return `if(instance.${pascalProp} == null) { instance.${pascalProp} = new Dictionary<${
          propModel.property.key.type
        }, ${propModel.property.value.type}>(); }
      var deserializedValue = ${renderDeserializeProperty(propModel)};
      instance.${pascalProp}.Add(propertyName, deserializedValue);
      continue;`;
      }
      if (propModel.property.options.const) {
        return undefined;
      }
      return `if (propertyName == "${propModel.unconstrainedPropertyName}")
  {
    var value = ${renderDeserializeProperty(propModel)};
    instance.${pascalProp} = value;
    continue;
  }`;
    })
    .filter((prop): prop is string => !!prop);
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
    throw new JsonException("Unexpected start of JSON");
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
      throw new JsonException("Unexpected property name token in JSON");
    }

    string propertyName = reader.GetString();
${renderer.indent(deserializeProperties, 4)}
    // Gracefully handle/ignore unknown fields
    JsonSerilizer.Deserialize(ref reader, options);
  }
  
  throw new JsonException("Unexpected end of JSON");
}`;
}

/**
 * Preset which adds `Serialize` and `Deserialize` functions to the class.
 *
 * @implements {CSharpPreset}
 */
export const CSHARP_JSON_SERIALIZER_PRESET: CSharpPreset<CSharpOptions> = {
  class: {
    additionalContent({ renderer, content, model }) {
      const supportFunctions = `public string Serialize()
{
  return this.Serialize(null);
}
public string Serialize(JsonSerializerOptions options = null) 
{
  return JsonSerializer.Serialize(this, options);
}
public static ${model.type} Deserialize(string json)
{
  var deserializeOptions = new JsonSerializerOptions();
  deserializeOptions.Converters.Add(new ${model.name}Converter());
  return JsonSerializer.Deserialize<${model.type}>(json, deserializeOptions);
}`;
      return `${content}\n${renderer.indent(supportFunctions)}`;
    },
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
${renderer.indent(deserialize)}
${renderer.indent(serialize)}

}
`;
    }
  }
};
