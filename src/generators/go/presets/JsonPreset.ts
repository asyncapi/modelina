import { FieldType, GoPreset } from '../GoPreset';

/**
 * Preset which adds basic JSON Tags for fields
 * 
 * @implements {GoPreset}
 */
export const GO_JSON_PRESET: GoPreset = {
  struct: {
    field({fieldName, content, type }) {
      if (type === FieldType.field) {
        return `${content} \`json:"${fieldName},omitempty"\``;
      }
      return `${content} \`json:"-"\``;
    },
  }
};
