import {
  ConstrainedArrayModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedMetaModel,
  ConstrainedStringModel
} from '../../../models';
import { KotlinPreset } from '../KotlinPreset';
import { ClassRenderer } from '../renderers/ClassRenderer';

export interface KotlinConstraintsPresetOptions {
  useJakarta: false;
}

export const KOTLIN_CONSTRAINTS_PRESET: KotlinPreset = {
  class: {
    self({ renderer, content, options }) {
      options = options || { useJakarta: false };
      const importFrom = options.useJakarta ? 'jakarta' : 'javax';
      renderer.dependencyManager.addDependency(
        `${importFrom}.validation.constraints.*`
      );
      return content;
    },
    property({ renderer, property, content }) {
      const annotations: string[] = [];

      if (property.required) {
        annotations.push(renderer.renderAnnotation('NotNull', null, 'get:'));
      }

      annotations.push(
        ...getTypeSpecificAnnotations(property.property, renderer)
      );

      return renderer.renderBlock([...annotations, content]);
    }
  }
};

function getTypeSpecificAnnotations(
  property: ConstrainedMetaModel,
  renderer: ClassRenderer
): string[] {
  if (property instanceof ConstrainedStringModel) {
    return getStringAnnotations(property, renderer);
  } else if (
    property instanceof ConstrainedFloatModel ||
    property instanceof ConstrainedIntegerModel
  ) {
    return getNumericAnnotations(property, renderer);
  } else if (property instanceof ConstrainedArrayModel) {
    return getArrayAnnotations(property, renderer);
  }

  return [];
}

function getStringAnnotations(
  property: ConstrainedStringModel,
  renderer: ClassRenderer
): string[] {
  const annotations: string[] = [];
  const originalInput = property.originalInput;

  if (originalInput['pattern'] !== undefined) {
    annotations.push(
      renderer.renderAnnotation(
        'Pattern',
        { regexp: `"${originalInput['pattern']}"` },
        'get:'
      )
    );
  }

  if (
    originalInput['minLength'] !== undefined ||
    originalInput['maxLength'] !== undefined
  ) {
    annotations.push(
      renderer.renderAnnotation(
        'Size',
        { min: originalInput['minLength'], max: originalInput['maxLength'] },
        'get:'
      )
    );
  }

  return annotations;
}

function getNumericAnnotations(
  property: ConstrainedIntegerModel | ConstrainedFloatModel,
  renderer: ClassRenderer
): string[] {
  const annotations: string[] = [];
  const originalInput = property.originalInput;

  if (originalInput['minimum'] !== undefined) {
    annotations.push(
      renderer.renderAnnotation('Min', originalInput['minimum'], 'get:')
    );
  }

  if (originalInput['exclusiveMinimum'] !== undefined) {
    annotations.push(
      renderer.renderAnnotation(
        'Min',
        originalInput['exclusiveMinimum'] + 1,
        'get:'
      )
    );
  }

  if (originalInput['maximum'] !== undefined) {
    annotations.push(
      renderer.renderAnnotation('Max', originalInput['maximum'], 'get:')
    );
  }

  if (originalInput['exclusiveMaximum'] !== undefined) {
    annotations.push(
      renderer.renderAnnotation(
        'Max',
        originalInput['exclusiveMaximum'] - 1,
        'get:'
      )
    );
  }

  return annotations;
}

function getArrayAnnotations(
  property: ConstrainedArrayModel,
  renderer: ClassRenderer
): string[] {
  const annotations: string[] = [];
  const originalInput = property.originalInput;

  if (
    originalInput['minItems'] !== undefined ||
    originalInput['maxItems'] !== undefined
  ) {
    annotations.push(
      renderer.renderAnnotation(
        'Size',
        { min: originalInput['minItems'], max: originalInput['maxItems'] },
        'get:'
      )
    );
  }

  return annotations;
}
