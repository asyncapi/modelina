import { RustRenderer } from '../RustRenderer';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../models';
import { EnumPresetType } from '../RustPreset';
import { RustOptions } from '../RustGenerator';

/**
 * Renderer for Rust's `enum` type
 *
 * @extends EnumRenderer
 */
export class EnumRenderer extends RustRenderer<ConstrainedEnumModel> {
  public async defaultSelf(): Promise<string> {
    const doc = this.renderComments(
      `${this.model.name} represents a ${this.model.name} model.`
    );
    const structMacro = await this.runStructMacroPreset();
    const items = await this.renderItems();
    const additionalContent = await this.runAdditionalContentPreset();
    return `${doc}
${structMacro}
pub enum ${this.model.name} {
${this.indent(items)}
}
${additionalContent}`;
  }

  async renderItems(): Promise<string> {
    const enums = this.model.values || [];
    const items = await Promise.all(
      enums.map(async (value, index) => {
        const macro = await this.runItemMacroPreset(value, index);
        const renderedItem = `${await this.runItemPreset(value, index)},`;
        return [macro, renderedItem];
      })
    );
    return this.renderBlock(items.flat());
  }

  runItemPreset(
    item: ConstrainedEnumValueModel,
    itemIndex: number
  ): Promise<string> {
    return this.runPreset('item', { item, itemIndex });
  }

  runItemMacroPreset(
    item: ConstrainedEnumValueModel,
    itemIndex: number
  ): Promise<string> {
    return this.runPreset('itemMacro', { item, itemIndex });
  }

  runStructMacroPreset(): Promise<string> {
    return this.runPreset('structMacro');
  }

  /**
   * Returns the type for the JSON value
   */
  renderEnumValueType(value: any): string {
    switch (typeof value) {
      case 'boolean':
        return 'bool';
      case 'bigint':
        return 'i64';
      case 'number': {
        return 'f64';
      }
      case 'object': {
        return 'HashMap<String, serde_json::Value>';
      }
      case 'string':
      default: {
        return 'String';
      }
    }
  }
}

export const RUST_DEFAULT_ENUM_PRESET: EnumPresetType<RustOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ item, renderer }) {
    const typeOfEnumValue = renderer.renderEnumValueType(item.value);
    if (typeOfEnumValue === 'HashMap<String, serde_json::Value>') {
      return `${item.key}(${typeOfEnumValue})`;
    }
    return `${item.key}`;
  },
  itemMacro({ item }) {
    const serdeArgs = [];
    if (typeof item.value === 'object') {
      serdeArgs.push('flatten');
    } else {
      serdeArgs.push(`rename="${item.value}"`);
    }
    return `#[serde(${serdeArgs.join(', ')})]`;
  },
  structMacro({ model, renderer }) {
    return renderer.renderMacro(model);
  }
};
