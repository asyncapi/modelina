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
  //Special case where a referenced enum model need to be accessed
  if (
    model.property instanceof ConstrainedReferenceModel &&
    model.property.ref instanceof ConstrainedEnumModel
  ) {
    return `writer.WriteRawValue(${modelInstanceVariable}${model.required ? '' : '?'}.GetRawJsonValue(), true);`;
  }
  return `JsonSerializer.Serialize(writer, ${modelInstanceVariable}, options);`;
}

function renderSerializeProperties(model: ConstrainedObjectModel) {
  let serializeProperties = '';
  if (model.properties !== undefined) {
    for (const [propertyName, propertyModel] of Object.entries(
      model.properties
    )) {
      const modelInstanceVariable = `value?.${pascalCase(propertyName)}`;
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
      return `prop.Name != "${pascalCase(value?.propertyName)}"`;
    });

  let propertiesList = 'var properties = value?.GetType().GetProperties();';
  if (unwrappedDictionaryProperties.length > 0) {
    renderer.dependencyManager.addDependency('using System.Linq;');
    propertiesList = `var properties = value?.GetType().GetProperties().Where(prop => ${unwrappedDictionaryProperties.join(
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
    return `${model.property.name}Extensions.FromJsonTo${model.property.name}(JsonSerializer.Deserialize<dynamic>(ref reader))`;
  } else if (
    model.property instanceof ConstrainedReferenceModel &&
    model.property.ref instanceof ConstrainedObjectModel
  ) {
    return `JsonSerializer.Deserialize<${model.property.name}>(ref reader)`;
  }

  return `JsonSerializer.Deserialize<${model.property.type}>(ref reader)`;
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
        }, ${propModel.property.value?.type}>(); }
      var deserializedValue = ${renderDeserializeProperty(propModel)};
      instance.${pascalProp}.Add(propertyName, deserializedValue);
      continue;`;
      }
      if (propModel.property.options.const) {
        return undefined;
      }
      return `if (propertyName == "${propModel.unconstrainedPropertyName}")
  {
    instance.${pascalProp} = ${renderDeserializeProperty(propModel)};
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

    // Advance to the value token
    reader.Read();
${renderer.indent(deserializeProperties, 4)}
  }
  
  throw new JsonException();
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
public static ${model.type} Deserialize(string json, JsonSerializerOptions options = null)
{
  return JsonSerializer.Deserialize<${model.type}>(json, options);
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
}`;
    }
  },
  enum: {
    self({ content, renderer }) {
      renderer.dependencyManager.addDependency('using System.Text.Json;');
      return content;
    },
    extensionMethods({ content, model, renderer }) {
      const enums = model.values || [];
      const items: string[] = [];
      const items2: string[] = [];

      for (const enumValue of enums) {
        const jsonValue = enumValue.value;
        const originalEnumValue = enumValue.originalInput;
        let stringValue = jsonValue;
        if (typeof jsonValue !== 'string') {
          stringValue = `"${jsonValue}"`;
        }
        items.push(
          `case ${model.name}.${enumValue.key}: return ${stringValue};`
        );

        if (typeof originalEnumValue === 'string') {
          items2.push(
            `if (value?.ValueKind == JsonValueKind.String && value?.GetString() == ${enumValue.value})
{
  return ${model.name}.${enumValue.key};
}`
          );
        } else if (originalEnumValue === null) {
          items2.push(
            `if (value == null || value?.ValueKind == JsonValueKind.Null && value?.GetRawText() == "null")
{
  return ${model.name}.${enumValue.key};
}`
          );
        } else if (typeof originalEnumValue === 'boolean') {
          items2.push(
            `if (value?.ValueKind == JsonValueKind.True || value?.ValueKind == JsonValueKind.False && value?.GetBoolean() == ${enumValue.value})
{
  return ${model.name}.${enumValue.key};
}`
          );
        } else if (Array.isArray(originalEnumValue)) {
          items2.push(
            `if (value?.ValueKind == JsonValueKind.Array && value?.GetRawText() == ${enumValue.value})
{
  return ${model.name}.${enumValue.key};
}`
          );
        } else if (typeof originalEnumValue === 'object') {
          items2.push(
            `if (value?.ValueKind == JsonValueKind.Object && value?.GetRawText() == ${enumValue.value})
{
  return ${model.name}.${enumValue.key};
}`
          );
        } else if (typeof originalEnumValue === 'number') {
          items2.push(
            `if (value?.ValueKind == JsonValueKind.Number && value?.GetInt32() == ${enumValue.value})
{
  return ${model.name}.${enumValue.key};
}`
          );
        } else if (typeof originalEnumValue === 'bigint') {
          items2.push(
            `if (value?.ValueKind == JsonValueKind.Number && value?.GetInt64() == ${enumValue.value})
{
  return ${model.name}.${enumValue.key};
}`
          );
        }
      }

      const newstuff = items.join('\n');
      const newstuff2 = items2.join('\n');
      return `${content}

public static string? GetRawJsonValue(this ${model.name} enumValue)
{
  switch (enumValue)
  {
${renderer.indent(newstuff, 3)}
  }
  return null;
}

public static ${model.type}? FromJsonTo${model.name}(JsonElement? value)
{
${renderer.indent(newstuff2, 2)}
  return null;
}`;
    }
  }
};
