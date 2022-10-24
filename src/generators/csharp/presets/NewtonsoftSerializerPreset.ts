import { CSharpPreset } from '../CSharpPreset';
import { ConstrainedDictionaryModel, ConstrainedObjectModel } from '../../../models';
import { CSharpOptions } from '../CSharpGenerator';

/**
 * Render `serialize` function based on model
 */
function renderSerialize({ model }: {
  model: ConstrainedObjectModel
}): string {
  const corePropsWrite = Object.values(model.properties)
    .filter((prop) => !(prop.property instanceof ConstrainedDictionaryModel) || prop.property.serializationType === 'normal')
    .map((prop) => {
      return `if (value.${prop.propertyName} != null)
{
  jo.Add("${prop.unconstrainedPropertyName}", JToken.FromObject(value.${prop.propertyName}, serializer));
}`;
    });
  const unwrapPropsWrite = Object.values(model.properties)
    .filter((prop) => prop.property instanceof ConstrainedDictionaryModel && prop.property.serializationType === 'unwrap')
    .map((prop) => {
      return `if (value.${prop.propertyName} != null)
  {
  foreach (var unwrapProperty in value.${prop.propertyName})
  {
    var hasProp = jo[unwrapProperty.Key]; 
    if (hasProp != null) continue;
    jo.Add(unwrapProperty.Key, JToken.FromObject(unwrapProperty.Value, serializer));
  }
}`;
    });
  return `public override void WriteJson(JsonWriter writer, ${model.name} value, JsonSerializer serializer)
{
  JObject jo = new JObject();

  ${corePropsWrite.join('\n')}
  ${unwrapPropsWrite.join('\n')}

  jo.WriteTo(writer);
}`;
}


/**
 * Render `deserialize` function based on model
 */
function renderDeserialize({ model }: {
  model: ConstrainedObjectModel
}): string {
  const unwrapDictionaryProps = Object.values(model.properties)
    .filter((prop) => prop.property instanceof ConstrainedDictionaryModel && prop.property.serializationType === 'unwrap');
  const corePropsRead = Object.values(model.properties)
    .filter((prop) => !(prop.property instanceof ConstrainedDictionaryModel) || prop.property.serializationType === 'normal')
    .map((prop) => {
      return `value.${prop.propertyName} = jo["${prop.unconstrainedPropertyName}"].ToObject<${prop.property.type}>(serializer);`;
    });
  const nonDictionaryPropCheck = unwrapDictionaryProps.map((prop) => {
      return `prop.Name != "${prop.unconstrainedPropertyName}"`;
    });
  const dictionaryPropCheck = unwrapDictionaryProps.map((prop) => {
      return `prop.Name == "${prop.unconstrainedPropertyName}"`;
    });
  const dictionaryInitializers = unwrapDictionaryProps.map((prop) => {
      return `value.${prop.propertyName} = new Dictionary<${(prop.property as ConstrainedDictionaryModel).key.type}, ${(prop.property as ConstrainedDictionaryModel).value.type}>();`;
    });
  const unwrapDictionaryRead = unwrapDictionaryProps.map((prop) => {
      return `value.${prop.propertyName}[additionalProperty.Name] = JsonConvert.DeserializeObject(additionalProperty.Value.ToString());`;
    });
  const additionalPropertiesCode = unwrapDictionaryProps.length !== 0 ? `var additionalProperties = jo.Properties().Where((prop) => ${nonDictionaryPropCheck.join(' || ')});
  var coreProperties = jo.Properties().Where((prop) => ${dictionaryPropCheck.join(' || ')});
  ${dictionaryInitializers}

  foreach (var additionalProperty in additionalProperties)
  {
    ${unwrapDictionaryRead.join('\n')}
  }` : '';
  return `public override ${model.name} ReadJson(JsonReader reader, Type objectType, ${model.name} existingValue, bool hasExistingValue, JsonSerializer serializer)
{
  JObject jo = JObject.Load(reader);
  ${model.name} value = new ${model.name}();

  ${corePropsRead.join('\n')}

  ${additionalPropertiesCode}
  return value;
}`;
}

/**
 * Preset which adds `serialize` and `deserialize` functions to class. 
 * 
 * @implements {CSharpPreset}
 */
export const CSHARP_NEWTONSOFT_SERIALIZER_PRESET: CSharpPreset<CSharpOptions> = {
  class: {
    self: ({ renderer, content, model }) => {
      renderer.addDependency('using Newtonsoft.Json;');
      renderer.addDependency('using Newtonsoft.Json.Linq;');
      renderer.addDependency('using System.Collections.Generic;');

      const deserialize = renderDeserialize({ model });
      const serialize = renderSerialize({ model });

      return `[JsonConverter(typeof(${model.name}Converter))]
${content}

public class ${model.name}Converter : JsonConverter<${model.name}>
{
  private readonly Type[] _types;

  public ${model.name}Converter(params Type[] types)
  {
    _types = types;
  }

  ${deserialize}
  ${serialize}

  public override bool CanRead => true;
  public override bool CanWrite => true;
}`;
    },
  },
};
