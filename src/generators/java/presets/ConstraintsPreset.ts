import {
  ConstrainedArrayModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedStringModel
} from '../../../models';
import { JavaPreset } from '../JavaPreset';

/**
 * Preset which extends class's getters with annotations from `javax.validation.constraints` package
 *
 * @implements {JavaPreset}
 */
export const JAVA_CONSTRAINTS_PRESET: JavaPreset = {
  class: {
    self({ renderer, content }) {
      renderer.dependencyManager.addDependency(
        'import javax.validation.constraints.*;'
      );
      return content;
    },
    // eslint-disable-next-line sonarjs/cognitive-complexity
    property({ renderer, property, content, model }) {
      if (model.options.isExtended) {
        return '';
      }

      const annotations: string[] = [];

      if (property.required) {
        annotations.push(renderer.renderAnnotation('NotNull'));
      }
      const originalInput = property.property.originalInput;

      // string
      if (property.property instanceof ConstrainedStringModel) {
        const pattern = originalInput['pattern'];
        if (pattern !== undefined) {
          annotations.push(
            renderer.renderAnnotation('Pattern', {
              regexp: renderer.renderStringLiteral(pattern)
            })
          );
        }
        const minLength = originalInput['minLength'];
        const maxLength = originalInput['maxLength'];
        if (minLength !== undefined || maxLength !== undefined) {
          annotations.push(
            renderer.renderAnnotation('Size', {
              min: minLength,
              max: maxLength
            })
          );
        }
      }

      // number/integer
      if (
        property.property instanceof ConstrainedFloatModel ||
        property.property instanceof ConstrainedIntegerModel
      ) {
        const minimum = originalInput['minimum'];
        if (minimum !== undefined) {
          annotations.push(renderer.renderAnnotation('Min', minimum));
        }
        const exclusiveMinimum = originalInput['exclusiveMinimum'];
        if (exclusiveMinimum !== undefined) {
          annotations.push(
            renderer.renderAnnotation('Min', exclusiveMinimum + 1)
          );
        }
        const maximum = originalInput['maximum'];
        if (maximum !== undefined) {
          annotations.push(renderer.renderAnnotation('Max', maximum));
        }
        const exclusiveMaximum = originalInput['exclusiveMaximum'];
        if (exclusiveMaximum !== undefined) {
          annotations.push(
            renderer.renderAnnotation('Max', exclusiveMaximum - 1)
          );
        }
      }

      // array
      if (property.property instanceof ConstrainedArrayModel) {
        const minItems = originalInput['minItems'];
        const maxItems = originalInput['maxItems'];
        if (minItems !== undefined || maxItems !== undefined) {
          annotations.push(
            renderer.renderAnnotation('Size', { min: minItems, max: maxItems })
          );
        }
      }

      return renderer.renderBlock([...annotations, content]);
    }
  }
};
