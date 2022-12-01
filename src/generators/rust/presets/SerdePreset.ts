import { ConstrainedEnumModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedUnionModel, ConstrainedEnumValueModel } from '../../../models';
import { EnumRenderer } from '../renderers/EnumRenderer';
import { RustPreset } from '../RustPreset';
import { Logger } from '../../../utils';
import { StructRenderer } from '../renderers/StructRenderer';

export interface RustSerdePresetOptions { }

export const defaultRustSerdePresetOptions: RustSerdePresetOptions = { };

export const RUST_SERDE_PRESET: RustPreset<RustSerdePresetOptions> = {
  enum: {
    itemMacro({ item }) {
      const serdeArgs = [];
      if (typeof item.value === 'object') {
        serdeArgs.push('flatten');
      } else {
        serdeArgs.push(`rename="${item.value}"`);
      }
      return `#[serde(${serdeArgs.join(', ')})]`;
    },
    item({item, content}){
      //Overwrite the original item content if something serde specific
      if(typeof item.value === 'object') {
        return `${item.key}(HashMap<String, serde_json::Value>)`;
      }
      return content;
    }
  },
  struct: {
    fieldMacro({ field }) {
      const serdeArgs: string[] = [];
      serdeArgs.push(`rename="${field.unconstrainedPropertyName}"`);
      if (!field.required) {
        serdeArgs.push('skip_serializing_if = "Option::is_none"');
      }
      return `#[serde(${serdeArgs.join(', ')})]`;
    },
  },
  union: {
    itemMacro({ item }) {
      const serdeArgs: string[] = [];
      serdeArgs.push(`rename="${item.name}"`);
      return `#[serde(${serdeArgs.join(', ')})]`;
    }
  },
  package: {

  }
};
