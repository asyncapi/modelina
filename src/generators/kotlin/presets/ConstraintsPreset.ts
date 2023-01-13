import {
  ConstrainedArrayModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedMetaModel,
  ConstrainedStringModel
} from '../../../models';
import { KotlinPreset } from '../KotlinPreset';
import {ClassRenderer} from '../renderers/ClassRenderer';

export const KOTLIN_CONSTRAINTS_PRESET: KotlinPreset = {
  class: {
    self({renderer, content}) {
      renderer.addDependency('import javax.validation.constraints.*');
      return content;
    },
    property({ renderer, property, content}) {
      let annotations: string[] = [];

      if (property.required) {
        annotations = [...annotations, renderer.renderAnnotation('NotNull', null, 'get:')];
      }

      annotations = [...annotations, ...getTypeSpecificAnnotations(property.property, renderer)];

      return renderer.renderBlock([...annotations, content]);
    }
  }
};

function getTypeSpecificAnnotations(property: ConstrainedMetaModel, renderer: ClassRenderer): string[] {
  if (property instanceof ConstrainedStringModel) {
    return getStringAnnotations(property, renderer);
  } else if (property instanceof ConstrainedFloatModel || property instanceof ConstrainedIntegerModel) {
    return getNumericAnnotations(property, renderer);
  } else if (property instanceof ConstrainedArrayModel) {
    return getArrayAnnotations(property, renderer);
  }

  return [];
}

function getStringAnnotations(property: ConstrainedStringModel, renderer: ClassRenderer): string[] {
  const annotations: string[] = [];
  const originalInput = property.originalInput;
  const pattern = originalInput['pattern'];
  if (pattern !== undefined) {
    annotations.push(renderer.renderAnnotation('Pattern', { regexp: `"${pattern}"` }, 'get:'));
  }
  const minLength = originalInput['minLength'];
  const maxLength = originalInput['maxLength'];
  if (minLength !== undefined || maxLength !== undefined) {
    annotations.push(renderer.renderAnnotation('Size', { min: minLength, max: maxLength }, 'get:'));
  }
  return annotations;
}

function getNumericAnnotations(property: ConstrainedIntegerModel | ConstrainedFloatModel, renderer: ClassRenderer): string[] {
  const annotations: string[] = [];
  const originalInput = property.originalInput;

  const minimum = originalInput['minimum'];
  if (minimum !== undefined) {
    annotations.push(renderer.renderAnnotation('Min', minimum, 'get:'));
  }
  const exclusiveMinimum = originalInput['exclusiveMinimum'];
  if (exclusiveMinimum !== undefined) {
    annotations.push(renderer.renderAnnotation('Min', exclusiveMinimum + 1), 'get:');
  }
  const maximum = originalInput['maximum'];
  if (maximum !== undefined) {
    annotations.push(renderer.renderAnnotation('Max', maximum, 'get:'));
  }
  const exclusiveMaximum = originalInput['exclusiveMaximum'];
  if (exclusiveMaximum !== undefined) {
    annotations.push(renderer.renderAnnotation('Max', exclusiveMaximum - 1, 'get:'));
  }

  return annotations;
}

function getArrayAnnotations(property: ConstrainedArrayModel, renderer: ClassRenderer): string[] {
  const annotations: string[] = [];
  const originalInput = property.originalInput;

  const minItems = originalInput['minItems'];
  const maxItems = originalInput['maxItems'];
  if (minItems !== undefined || maxItems !== undefined) {
    annotations.push(renderer.renderAnnotation('Size', { min: minItems, max: maxItems }, 'get:'));
  }

  return annotations;
}
