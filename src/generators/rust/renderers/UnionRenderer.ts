import { RustRenderer } from '../RustRenderer';
import { ConstrainedUnionModel, ConstrainedMetaModel, ConstrainedReferenceModel } from '../../../models';
import { UnionPresetType } from '../RustPreset';
import { RustOptions } from '../RustGenerator';

/**
 * Renderer for Rust's `Union` type
 * 
 * @extends UnionRenderer
 */
export class UnionRenderer extends RustRenderer<ConstrainedUnionModel> {
  public async defaultSelf(): Promise<string> {
    const doc = this.renderComments(`${this.model.name} represents a union of types: ${this.model.union.map(m => m.type).join(', ')}`);
    const structMacro = await this.runStructMacroPreset();
    const variants = await Promise.all(this.model.union.map(async (v) => {
      const macro = await this.runItemMacroPreset(v);
      const variant = `${await this.runItemPreset(v)},`;
      return [macro, variant];
    }));
    const additionalContent = await this.runAdditionalContentPreset();
    return `${doc}
${structMacro}
pub enum ${this.model.name} {
${this.indent(this.renderBlock(variants.flat()))}
}
${additionalContent}
`;
  }

  runStructMacroPreset(): Promise<string> {
    return this.runPreset('structMacro');
  }

  runItemMacroPreset(item: ConstrainedMetaModel): Promise<string> {
    return this.runPreset('itemMacro', { item });
  }

  runItemPreset(item: ConstrainedMetaModel): Promise<string> {
    return this.runPreset('item', { item });
  }
}

export const RUST_DEFAULT_UNION_PRESET: UnionPresetType<RustOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },

  structMacro({ model, renderer }) {
    return renderer.renderMacro(model);
  },
  itemMacro({ item }) {
    const serdeArgs: string[] = [];
    serdeArgs.push(`rename="${item.name}"`);
    return `#[serde(${serdeArgs.join(', ')})]`;
  },
  item({ item }) {
    if (item instanceof ConstrainedReferenceModel) {
      return `${item.name}(crate::${item.ref.type})`;
    }
    return `${item.name}(${item.type})`;
  }
};
