import { DartPreset } from '../DartPreset';
/**
 * Preset which extends class's getters with annotations from `javax.validation.constraints` package
 * 
 * @implements {JavaPreset}
 */
export const DART_CONSTRAINTS_PRESET: DartPreset = {
  class: {
    self({renderer, content}) {
      renderer.addDependency('import javax.validation.constraints.*;');
      return content;
    },
    getter({ renderer, model, propertyName, property, content }) {
      const annotations: string[] = [];
      
      const isRequired = model.isRequired(propertyName);
      if (isRequired) {
        annotations.push(renderer.renderAnnotation('NotNull'));
      }
    
      // string
      const pattern = property.getFromOriginalInput('pattern');
      if (pattern !== undefined) {
        annotations.push(renderer.renderAnnotation('Pattern', { regexp: `"${pattern}"` }));
      }
      const minLength = property.getFromOriginalInput('minLength');
      const maxLength = property.getFromOriginalInput('maxLength');
      if (minLength !== undefined || maxLength !== undefined) {
        annotations.push(renderer.renderAnnotation('Size', { min: minLength, max: maxLength }));
      }
    
      // number/integer
      const minimum = property.getFromOriginalInput('minimum');
      if (minimum !== undefined) {
        annotations.push(renderer.renderAnnotation('Min', minimum));
      }
      const exclusiveMinimum = property.getFromOriginalInput('exclusiveMinimum');
      if (exclusiveMinimum !== undefined) {
        annotations.push(renderer.renderAnnotation('Min', exclusiveMinimum + 1));
      }
      const maximum = property.getFromOriginalInput('maximum');
      if (maximum !== undefined) {
        annotations.push(renderer.renderAnnotation('Max', maximum));
      }
      const exclusiveMaximum = property.getFromOriginalInput('exclusiveMaximum');
      if (exclusiveMaximum !== undefined) {
        annotations.push(renderer.renderAnnotation('Max', exclusiveMaximum - 1));
      }
    
      // array
      const minItems = property.getFromOriginalInput('minItems');
      const maxItems = property.getFromOriginalInput('maxItems');
      if (minItems !== undefined || maxItems !== undefined) {
        annotations.push(renderer.renderAnnotation('Size', { min: minItems, max: maxItems }));
      }
    
      return renderer.renderBlock([...annotations, content]);
    },
  }
};
