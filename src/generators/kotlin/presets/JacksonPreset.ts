import { ConstrainedDictionaryModel } from '../../../models';
import { KotlinPreset } from '../KotlinPreset';

const JACKSON_ANNOTATION_DEPENDENCY = 'com.fasterxml.jackson.annotation.*';

/**
 * Preset which adds Jackson annotations for JSON serialization and deserialization.
 */
export const KOTLIN_JACKSON_PRESET: KotlinPreset = {
  class: {
    self({ renderer, content }) {
      renderer.dependencyManager.addDependency(JACKSON_ANNOTATION_DEPENDENCY);
      return content;
    },
    property({ renderer, property, content }) {
      const isUnwrappedDictionary =
        property.property instanceof ConstrainedDictionaryModel &&
        property.property.serializationType === 'unwrap';
      if (isUnwrappedDictionary) {
        const mutableMapType = property.property.type.replace(
          /^Map</,
          'MutableMap<'
        );
        return renderer.renderBlock([
          renderer.renderAnnotation('JsonAnyGetter', undefined, 'get:'),
          renderer.renderAnnotation('JsonAnySetter', undefined, 'field:'),
          `val ${property.propertyName}: ${mutableMapType} = mutableMapOf(),`
        ]);
      }

      const annotations = [
        renderer.renderAnnotation(
          'JsonProperty',
          `"${property.unconstrainedPropertyName}"`,
          'get:'
        )
      ];
      if (!property.required) {
        annotations.push(
          renderer.renderAnnotation(
            'JsonInclude',
            'JsonInclude.Include.NON_NULL',
            'get:'
          )
        );
      }
      return renderer.renderBlock([...annotations, content]);
    }
  },
  enum: {
    self({ renderer, content }) {
      renderer.dependencyManager.addDependency(JACKSON_ANNOTATION_DEPENDENCY);
      return content;
    },
    item({ content, model, item }) {
      const defaultEnumValue = model.originalInput?.default;
      return item.originalInput === defaultEnumValue
        ? `@JsonEnumDefaultValue ${content}`
        : content;
    },
    value({ content }) {
      return `@get:JsonValue ${content}`;
    },
    fromValue({ model }) {
      return `companion object {
    @JvmStatic
    @JsonCreator
    fun forValue(value: ${model.type}): ${model.name} {
        return values().firstOrNull { it.value == value }
            ?: throw IllegalArgumentException("Unexpected value '$value'")
    }
}`;
    }
  }
};
