import { RustRenderer } from '../RustRenderer';
import { ConstrainedEnumModel, ConstrainedEnumValueModel } from '../../../models';
import { EnumPresetType } from '../RustPreset';
import { RustOptions } from '../RustGenerator';

/**
 * Renderer for Rust's `enum` type
 * 
 * @extends EnumRenderer
 */
export class EnumRenderer extends RustRenderer<ConstrainedEnumModel> {
  public async defaultSelf(): Promise<string> {
    const doc = this.renderComments(`${this.model.name} represents a ${this.model.name} model.`);
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
    const items = await Promise.all(enums.map(async (value, index) => {
      const macro = await this.runItemMacroPreset(value, index);
      const renderedItem = `${await this.runItemPreset(value, index)},`;
      return [macro, renderedItem];
    }));
    return this.renderBlock(items.flat());
  }

  runItemPreset(item: ConstrainedEnumValueModel, itemIndex: number): Promise<string> {
    return this.runPreset('item', { item, itemIndex });
  }

  runItemMacroPreset(item: ConstrainedEnumValueModel, itemIndex: number): Promise<string> {
    return this.runPreset('itemMacro', { item, itemIndex });
  }

  runStructMacroPreset(): Promise<string> {
    return this.runPreset('structMacro');
  }
}

export const RUST_DEFAULT_ENUM_PRESET: EnumPresetType<RustOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ item }) {
    if (item.value === 'HashMap<String, serde_json::Value>') {
      return `${item.key}(${item.value})`;
    }
    return `${item.key}`;
  },
  itemMacro({ itemIndex, model }) {
    const originalInput = model.originalInput.enum[itemIndex];
    const serdeArgs = [];
    if (typeof originalInput === 'object') {
      serdeArgs.push('flatten');
    } else {
      const rename = model.originalInput.enum[itemIndex].toString();
      serdeArgs.push(`rename="${rename}"`);
    }
    return `#[serde(${serdeArgs.join(', ')})]`;
  },
  structMacro({ model, renderer }) {
    return renderer.renderMacro(model);
  },
};
