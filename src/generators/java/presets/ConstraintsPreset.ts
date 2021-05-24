import { JavaPreset } from '../JavaPreset';

import { CommonModel } from '../../../models';

/**
 * Preset which extends class's getters with annotations from `javax.validation.constraints` package
 * 
 * @implements {JavaPreset}
 */
export const JAVA_CONSTRAINTS_PRESET: JavaPreset = {
  class: {
    getter({ renderer, model, propertyName, property, content }) {
      if (!(property instanceof CommonModel)) 
        return content;
      
      const annotations: string[] = [];
      
      const isRequired = model.isRequired(propertyName);
      if (isRequired) 
        annotations.push(renderer.renderAnnotation('NotNull'));
    
      // string
      const pattern = property.getFromSchema('pattern');
      if (pattern !== undefined) 
        annotations.push(renderer.renderAnnotation('Pattern', { regexp: `"${pattern}"` }));
      
      const minLength = property.getFromSchema('minLength');
      const maxLength = property.getFromSchema('maxLength');
      if (minLength !== undefined || maxLength !== undefined) 
        annotations.push(renderer.renderAnnotation('Size', { min: minLength, max: maxLength }));
    
      // number/integer
      const minimum = property.getFromSchema('minimum');
      if (minimum !== undefined) 
        annotations.push(renderer.renderAnnotation('Min', minimum));
      
      const exclusiveMinimum = property.getFromSchema('exclusiveMinimum');
      if (exclusiveMinimum !== undefined) 
        annotations.push(renderer.renderAnnotation('Min', exclusiveMinimum + 1));
      
      const maximum = property.getFromSchema('maximum');
      if (maximum !== undefined) 
        annotations.push(renderer.renderAnnotation('Max', maximum));
      
      const exclusiveMaximum = property.getFromSchema('exclusiveMaximum');
      if (exclusiveMaximum !== undefined) 
        annotations.push(renderer.renderAnnotation('Max', exclusiveMaximum - 1));
    
      // array
      const minItems = property.getFromSchema('minItems');
      const maxItems = property.getFromSchema('maxItems');
      if (minItems !== undefined || maxItems !== undefined) 
        annotations.push(renderer.renderAnnotation('Size', { min: minItems, max: maxItems }));
    
      return renderer.renderBlock([...annotations, content]);
    },
  }
};
