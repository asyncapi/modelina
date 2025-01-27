import { CSharpPreset } from '../CSharpPreset';
import {
  ConstrainedDictionaryModel,
  ConstrainedEnumModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel
} from '../../../models';
import { CSharpOptions } from '../CSharpGenerator';
import { pascalCase } from 'change-case';

/**
 * Render `serialize` function based on model
 */
function renderSerialize({ model }: { model: ConstrainedObjectModel }): string {
  const corePropsWrite = Object.values(model.properties)
    .filter(
      (prop) =>
        !(prop.property instanceof ConstrainedDictionaryModel) ||
        prop.property.serializationType === 'normal'
    )
    .map((prop) => {
      const propertyAccessor = pascalCase(prop.propertyName);
      let toJson = `jo.Add("${prop.unconstrainedPropertyName}", JToken.FromObject(value.${propertyAccessor}, serializer));`;
      if (
        prop.property instanceof ConstrainedReferenceModel &&
        prop.property.ref instanceof ConstrainedEnumModel
      ) {
        toJson = `var enumValue = ${prop.property.name}Extensions.GetValue((${prop.property.name})value.${propertyAccessor});
var stringEnumValue = enumValue.ToString();
// C# converts booleans to uppercase True and False, which newtonsoft cannot understand
var jsonStringCompliant = stringEnumValue == "True" || stringEnumValue == "False" ? stringEnumValue.ToLower() : stringEnumValue;
jo.Add("${prop.unconstrainedPropertyName}", JToken.FromObject(jsonStringCompliant, serializer));`;
      }
      return `if (value.${propertyAccessor} != null)
{
  ${toJson}
}`;
    });
  const unwrapPropsWrite = Object.values(model.properties)
    .filter(
      (prop) =>
        prop.property instanceof ConstrainedDictionaryModel &&
        prop.property.serializationType === 'unwrap'
    )
    .map((prop) => {
      const propertyAccessor = pascalCase(prop.propertyName);
      return `if (value.${propertyAccessor} != null)
  {
  foreach (var unwrapProperty in value.${propertyAccessor})
  {
    var hasProp = jo[unwrapProperty.Key]; 
    if (hasProp != null) continue;
    jo.Add(unwrapProperty.Key, JToken.FromObject(unwrapProperty.Value, serializer));
  }
}`;
    });
  return `public override void WriteJson(JsonWriter writer, ${
    model.name
  } value, JsonSerializer serializer)
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
function renderDeserialize({
  model,
  options
}: {
  model: ConstrainedObjectModel;
  options: CSharpOptions;
}): string {
  const unwrapDictionaryProps = Object.values(model.properties).filter(
    (prop) =>
      prop.property instanceof ConstrainedDictionaryModel &&
      prop.property.serializationType === 'unwrap'
  );
  const coreProps = Object.values(model.properties).filter(
    (prop) =>
      !(prop.property instanceof ConstrainedDictionaryModel) ||
      prop.property.serializationType === 'normal'
  );

  const corePropsRead = coreProps.map((prop) => {
    const propertyAccessor = pascalCase(prop.propertyName);
    let toValue = `jo["${prop.unconstrainedPropertyName}"].ToObject<${prop.property.type}>(serializer)`;
    if (
      prop.property instanceof ConstrainedReferenceModel &&
      prop.property.ref instanceof ConstrainedEnumModel
    ) {
      toValue = `${prop.property.name}Extensions.To${prop.property.name}(jo["${
        prop.unconstrainedPropertyName
      }"].ToString())${prop.required ? '.Value' : ''}`;
    }

    if (
      options?.enforceRequired !== undefined &&
      options?.enforceRequired &&
      prop.required
    ) {
      return `if(jo["${prop.unconstrainedPropertyName}"] is null){
  throw new JsonSerializationException("Required property '${prop.unconstrainedPropertyName}' is missing");
}
value.${propertyAccessor} = ${toValue};
`;
    }

    return `if(jo["${prop.unconstrainedPropertyName}"] != null) {
  value.${propertyAccessor} = ${toValue};
}`;
    })
    .filter((prop): prop is string => !!prop);
  const nonDictionaryPropCheck = coreProps.map((prop) => {
    return `prop.Name != "${prop.unconstrainedPropertyName}"`;
  });
  const dictionaryInitializers = unwrapDictionaryProps.map((prop) => {
    const propertyAccessor = pascalCase(prop.propertyName);
    return `value.${propertyAccessor} = new Dictionary<${
      (prop.property as ConstrainedDictionaryModel).key.type
    }, ${(prop.property as ConstrainedDictionaryModel).value.type}>();`;
  });
  const unwrapDictionaryRead = unwrapDictionaryProps.map((prop) => {
    const propertyAccessor = pascalCase(prop.propertyName);
    return `value.${propertyAccessor}[additionalProperty.Name] = additionalProperty.Value.ToObject<${
      (prop.property as ConstrainedDictionaryModel).value.type
    }>(serializer);`;
  });
  const additionalPropertiesCode =
    unwrapDictionaryProps.length !== 0
      ? `var additionalProperties = jo.Properties().Where((prop) => ${nonDictionaryPropCheck.join(
          ' || '
        )});
  ${dictionaryInitializers}

  foreach (var additionalProperty in additionalProperties)
  {
    ${unwrapDictionaryRead.join('\n')}
  }`
      : '';
  return `public override ${
    model.name
  } ReadJson(JsonReader reader, System.Type objectType, ${
    model.name
  } existingValue, bool hasExistingValue, JsonSerializer serializer)
{
  JObject jo = JObject.Load(reader);
  ${model.name} value = new ${model.name}();

  ${corePropsRead.join('\n')}

  ${additionalPropertiesCode}
  return value;
}`;
}

/**
 * Preset which adds Newtonsoft/JSON.net converters for serializing and deserializing the data models
 *
 * @implements {CSharpPreset}
 */
export const CSHARP_NEWTONSOFT_SERIALIZER_PRESET: CSharpPreset<CSharpOptions> =
  {
    class: {
      additionalContent: ({ content, model, renderer }) => {
        return renderer.indent(`${content}
public string Serialize()
{
  return JsonConvert.SerializeObject(this);
}
public static ${model.name} Deserialize(string json)
{
  return JsonConvert.DeserializeObject<${model.name}>(json);
}`);
      },
      self: ({ renderer, content, model, options }) => {
        renderer.dependencyManager.addDependency('using Newtonsoft.Json;');
        renderer.dependencyManager.addDependency('using Newtonsoft.Json.Linq;');
        renderer.dependencyManager.addDependency(
          'using System.Collections.Generic;'
        );
        renderer.dependencyManager.addDependency('using System.Linq;');

        const deserialize = renderDeserialize({ model, options });
        const serialize = renderSerialize({ model });

        return `[JsonConverter(typeof(${model.name}Converter))]
${content}

public class ${model.name}Converter : JsonConverter<${model.name}>
{
  ${deserialize}
  ${serialize}

  public override bool CanRead => true;
  public override bool CanWrite => true;
}`;
      }
    }
  };
