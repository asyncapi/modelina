import { RustPreset } from '../RustPreset';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RustSerdePresetOptions { }
export const defaultRustSerdePresetOptions: RustSerdePresetOptions = { };

/**
 * Render the previous content and a new line only if present.
 */
function getPreviousMacro(content: string | undefined) {
  return content === undefined ? `${content}\n` : '';
}

export const RUST_SERDE_PRESET: RustPreset<RustSerdePresetOptions> = {
  enum: {
    structMacro({content}) {
      const previousMacro = getPreviousMacro(content);
      return `${previousMacro}#[derive('Deserialize', 'Serialize')]`;
    },
    itemMacro({ item, content }) {
      const serdeArgs = [];
      if (typeof item.value === 'object') {
        serdeArgs.push('flatten');
      } else {
        serdeArgs.push(`rename="${item.value}"`);
      }
      const previousMacro = getPreviousMacro(content);
      return `${previousMacro}#[serde(${serdeArgs.join(', ')})]`;
    },
    item({item, content}) {
      //Overwrite the original item content if something serde specific
      if (typeof item.value === 'object') {
        return `${item.key}(HashMap<String, serde_json::Value>)`;
      }
      return content;
    }
  },
  struct: {
    structMacro({content}) {
      const previousMacro = getPreviousMacro(content);
      return `${previousMacro}#[derive('Deserialize', 'Serialize')]`;
    },
    fieldMacro({ field, content }) {
      const serdeArgs: string[] = [];
      serdeArgs.push(`rename="${field.unconstrainedPropertyName}"`);
      if (!field.required) {
        serdeArgs.push('skip_serializing_if = "Option::is_none"');
      }
      const previousMacro = getPreviousMacro(content);
      return `${previousMacro}#[serde(${serdeArgs.join(', ')})]`;
    },
  },
  tuple: {
    structMacro({content}) {
      const previousMacro = getPreviousMacro(content);
      return `${previousMacro}#[derive('Deserialize', 'Serialize')]`;
    },
  },
  union: {
    structMacro({content}) {
      const previousMacro = getPreviousMacro(content);
      return `${previousMacro}#[derive('Deserialize', 'Serialize')]`;
    },
    itemMacro({ item, content }) {
      const serdeArgs: string[] = [];
      serdeArgs.push(`rename="${item.name}"`);
      const previousMacro = getPreviousMacro(content);
      return `${previousMacro}#[serde(${serdeArgs.join(', ')})]`;
    }
  }
};
