import { ConstrainedDictionaryModel } from '../../../models';
import { GoPreset } from '../GoPreset';

/**
 * Preset which adds basic JSON Tags for fields
 * 
 * @implements {GoPreset}
 */
export const GO_JSON_TAG_PRESET: GoPreset = {
  struct: {
    fieldTag({field, content }) {
      let jsonTag = '';
      if (field.property instanceof ConstrainedDictionaryModel && 
        field.property.serializationType === 'unwrap') {
        jsonTag = 'json:"-"';
      }
      jsonTag = `json:"${field.unconstrainedPropertyName},omitempty"`;
      return `${content}${jsonTag}`;
    }
  }
};
