import { ConstrainedDictionaryModel } from '../../../models';
import { JavaPreset } from '../JavaPreset';

/**
 * Preset which adds `com.fasterxml.jackson` related annotations to class's property getters.
 *
 * @implements {JavaPreset}
 */
export const JAVA_JACKSON_PRESET: JavaPreset = {
  class: {
    self({ renderer, content }) {
      renderer.dependencyManager.addDependency(
        'import com.fasterxml.jackson.annotation.*;'
      );
      return content;
    },
    property({ renderer, property, content }) {
      //Properties that are dictionaries with unwrapped options, cannot get the annotation because it cannot be accurately unwrapped by the jackson library.
      const isDictionary =
        property.property instanceof ConstrainedDictionaryModel;
      const hasUnwrappedOptions =
        isDictionary &&
        (property.property as ConstrainedDictionaryModel).serializationType ===
          'unwrap';
      if (!hasUnwrappedOptions) {
        const annotation = renderer.renderAnnotation(
          'JsonProperty',
          `"${property.unconstrainedPropertyName}"`
        );
        return renderer.renderBlock([annotation, content]);
      }
      return renderer.renderBlock([content]);
    }
  },
  enum: {
    self({ renderer, content }) {
      renderer.dependencyManager.addDependency(
        'import com.fasterxml.jackson.annotation.*;'
      );
      return content;
    },
    getValue({ content }) {
      return `@JsonValue
${content}`;
    },
    fromValue({ content }) {
      return `@JsonCreator
${content}`;
    }
  }
};
