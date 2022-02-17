import { FieldType, GoPreset } from '../GoPreset';

/**
 * Preset which adds basic JSON Tags for fields
 * 
 * @implements {GoPreset}
 */
export const GO_JSON_PRESET: GoPreset = {
  struct: {
    fieldTag({fieldName, content, type }) {
      if (content !== '') {
        content = `${content},`;
      }
      if (type === FieldType.field) {
        return `${content}json:"${fieldName},omitempty"`;
      }
      return `${content}json:"-"`;
    },
  }
};
