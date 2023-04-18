import { ConstrainedDictionaryModel } from '../../../models';
import { JavaPreset } from '../JavaPreset';

const JACKSON_ANNOTATION_DEPENDENCY =
  'import com.fasterxml.jackson.annotation.*;';

/**
 * Preset which adds `com.fasterxml.jackson` related annotations to class's property getters.
 *
 * @implements {JavaPreset}
 */
export const JAVA_JACKSON_PRESET: JavaPreset = {
  class: {
    self({ renderer, content }) {
      renderer.dependencyManager.addDependency(JACKSON_ANNOTATION_DEPENDENCY);
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
      renderer.dependencyManager.addDependency(JACKSON_ANNOTATION_DEPENDENCY);
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
  },
  union: {
    self({ renderer, content, model }) {
      renderer.dependencyManager.addDependency(JACKSON_ANNOTATION_DEPENDENCY);

      let typeAnnotation;
      if (model.originalInput.discriminator !== undefined) {
        typeAnnotation = renderer.renderAnnotation('JsonTypeInfo', {
          use: 'JsonTypeInfo.Id.NAME',
          include: 'JsonTypeInfo.As.PROPERTY',
          property: `"${model.originalInput.discriminator}"`
        });
      } else {
        typeAnnotation = renderer.renderAnnotation('JsonTypeInfo', {
          use: 'JsonTypeInfo.Id.DEDUCTION'
        });
      }

      const types = model.union
        .map(
          (u) =>
            `  @JsonSubTypes.Type(value = ${u.name}.class, name = "${u.name}")`
        )
        .join(',\n');

      const subTypeAnnotation = renderer.renderAnnotation(
        'JsonSubTypes',
        `{\n${types}\n}`
      );
      return renderer.renderBlock([typeAnnotation, subTypeAnnotation, content]);
    }
  }
};
