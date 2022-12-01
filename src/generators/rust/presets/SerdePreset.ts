import { RustPreset } from '../RustPreset';

export interface RustSerdePresetOptions { }
export const defaultRustSerdePresetOptions: RustSerdePresetOptions = { };

export const RUST_SERDE_PRESET: RustPreset<RustSerdePresetOptions> = {
  enum: {
    structMacro({content}) {
      return `${content}\n#[derive('Deserialize', 'Serialize')]`;
    },
    itemMacro({ item, content }) {
      const serdeArgs = [];
      if (typeof item.value === 'object') {
        serdeArgs.push('flatten');
      } else {
        serdeArgs.push(`rename="${item.value}"`);
      }
      return `${content}\n#[serde(${serdeArgs.join(', ')})]`;
    },
    item({item, content}){
      //Overwrite the original item content if something serde specific
      if (typeof item.value === 'object') {
        return `${item.key}(HashMap<String, serde_json::Value>)`;
      }
      return content;
    }
  },
  struct: {
    structMacro({content}) {
      return `${content}\n#[derive('Deserialize', 'Serialize')]`;
    },
    fieldMacro({ field, content }) {
      const serdeArgs: string[] = [];
      serdeArgs.push(`rename="${field.unconstrainedPropertyName}"`);
      if (!field.required) {
        serdeArgs.push('skip_serializing_if = "Option::is_none"');
      }
      return `${content}\n#[serde(${serdeArgs.join(', ')})]`;
    },
  },
  tuple: {
    structMacro({content}) {
      return `${content}\n#[derive('Deserialize', 'Serialize')]`;
    },
  },
  union: {
    structMacro({content}) {
      return `${content}\n#[derive('Deserialize', 'Serialize')]`;
    },
    itemMacro({ item, content }) {
      const serdeArgs: string[] = [];
      serdeArgs.push(`rename="${item.name}"`);
      return `${content}\n#[serde(${serdeArgs.join(', ')})]`;
    }
  }
};
