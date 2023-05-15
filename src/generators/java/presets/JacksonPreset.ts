import {
  ConstrainedDictionaryModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel
} from '../../../models';
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

      const blocks: string[] = [];

      if (model.options.discriminator) {
        const { discriminator } = model.options;
        blocks.push(
          renderer.renderAnnotation('JsonTypeInfo', {
            use: 'JsonTypeInfo.Id.NAME',
            include: 'JsonTypeInfo.As.EXISTING_PROPERTY',
            property: `"${discriminator.discriminator}"`
          })
        );

        const types = model.union
          .map((union) => {
            if (
              union instanceof ConstrainedReferenceModel &&
              union.ref instanceof ConstrainedObjectModel
            ) {
              const discriminatorProp =
                union.ref.properties[discriminator.discriminator].property;

              if (discriminatorProp.options.const) {
                return `  @JsonSubTypes.Type(value = ${union.name}.class, name = "${discriminatorProp.options.const.originalInput}")`;
              }
            }

            return `  @JsonSubTypes.Type(value = ${union.name}.class, name = "${union.name}")`;
          })
          .join(',\n');

        blocks.push(
          renderer.renderAnnotation('JsonSubTypes', `{\n${types}\n}`)
        );
      } else {
        blocks.push(
          renderer.renderAnnotation('JsonTypeInfo', {
            use: 'JsonTypeInfo.Id.DEDUCTION'
          })
        );

        const types = model.union
          .map(
            (union) =>
              `  @JsonSubTypes.Type(value = ${union.name}.class, name = "${union.name}")`
          )
          .join(',\n');

        blocks.push(
          renderer.renderAnnotation('JsonSubTypes', `{\n${types}\n}`)
        );
      }

      return renderer.renderBlock([...blocks, content]);
    }
  }
};
