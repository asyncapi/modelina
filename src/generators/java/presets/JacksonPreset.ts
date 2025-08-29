import {
  ConstrainedDictionaryModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedUnionModel
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
    property({ renderer, property, content, model }) {
      if (model.options.isExtended) {
        return '';
      }

      //Properties that are dictionaries with unwrapped options, cannot get the annotation because it cannot be accurately unwrapped by the jackson library.
      const isDictionary =
        property.property instanceof ConstrainedDictionaryModel;
      const hasUnwrappedOptions =
        isDictionary &&
        (property.property as ConstrainedDictionaryModel).serializationType ===
          'unwrap';

      const blocks: string[] = [];

      if (hasUnwrappedOptions) {
        blocks.push(renderer.renderAnnotation('JsonAnySetter'));
        if (!property.required) {
          blocks.push(
            renderer.renderAnnotation(
              'JsonInclude',
              'JsonInclude.Include.NON_NULL'
            )
          );
        }

        blocks.push(content);

        return renderer.renderBlock(blocks);
      }

      blocks.push(
        renderer.renderAnnotation(
          'JsonProperty',
          `"${property.unconstrainedPropertyName}"`
        )
      );

      if (!property.required) {
        blocks.push(
          renderer.renderAnnotation(
            'JsonInclude',
            'JsonInclude.Include.NON_NULL'
          )
        );
      }

      blocks.push(content);

      return renderer.renderBlock(blocks);
    },
    getter({ renderer, property, content, model }) {
      if (model.options.isExtended) {
        return content;
      }
      //Properties that are dictionaries with unwrapped options, cannot get the annotation because it cannot be accurately unwrapped by the jackson library.
      const isDictionary =
        property.property instanceof ConstrainedDictionaryModel;
      const hasUnwrappedOptions =
        isDictionary &&
        (property.property as ConstrainedDictionaryModel).serializationType ===
          'unwrap';
      const blocks: string[] = [];
      if (hasUnwrappedOptions) {
        blocks.push(renderer.renderAnnotation('JsonAnyGetter'));
      }
      blocks.push(content);
      return renderer.renderBlock(blocks);
    }
  },
  enum: {
    // Fallback for unknown enum values has to be configured on the ObjectMapper
    // objectMapper.configure(
    //  DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_USING_DEFAULT_VALUE, true
    // );
    item({ content, model, item }) {
      const defaultEnumValue = model.originalInput?.default;
      if (item.originalInput === defaultEnumValue) {
        return `@JsonEnumDefaultValue ${content}`;
      }
      return content;
    },
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
        const defaultDiscriminator =
          model.originalInput?.properties?.[discriminator.discriminator]
            ?.default;

        if (defaultDiscriminator) {
          blocks.push(
            renderer.renderAnnotation('JsonTypeInfo', {
              use: 'JsonTypeInfo.Id.NAME',
              include: 'JsonTypeInfo.As.EXISTING_PROPERTY',
              defaultImpl: findClassNameOfSubtype(
                model,
                discriminator.discriminator,
                defaultDiscriminator
              ),
              property: `"${discriminator.discriminator}"`,
              visible: 'true'
            })
          );
        } else {
          blocks.push(
            renderer.renderAnnotation('JsonTypeInfo', {
              use: 'JsonTypeInfo.Id.NAME',
              include: 'JsonTypeInfo.As.EXISTING_PROPERTY',
              property: `"${discriminator.discriminator}"`,
              visible: 'true'
            })
          );
        }

        const types = model.union
          .map((union) => {
            if (
              union instanceof ConstrainedReferenceModel &&
              union.ref instanceof ConstrainedObjectModel
            ) {
              const discriminatorProp = Object.values(
                union.ref.properties
              ).find(
                (model) =>
                  model.unconstrainedPropertyName ===
                  discriminator.discriminator
              );

              if (discriminatorProp?.property.options.const) {
                return `  @JsonSubTypes.Type(value = ${union.name}.class, name = "${discriminatorProp.property.options.const.originalInput}")`;
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

function findClassNameOfSubtype(
  model: ConstrainedUnionModel,
  discriminatorPropertyName: string,
  discriminatorValue: string
): string {
  for (const union of model.union) {
    if (
      union instanceof ConstrainedReferenceModel &&
      union.ref instanceof ConstrainedObjectModel
    ) {
      const discriminatorProp = Object.values(union.ref.properties).find(
        (model) => model.unconstrainedPropertyName === discriminatorPropertyName
      );
      if (
        discriminatorProp?.property.options.const?.originalInput ===
        discriminatorValue
      ) {
        return `${union.name}.class`;
      }
    }
  }
  return `${discriminatorValue}.class`;
}
