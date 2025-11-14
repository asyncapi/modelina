import { RustRenderer } from '../RustRenderer';
import { ConstrainedMetaModel } from '../../../models';
import { NewTypePresetType } from '../RustPreset';
import { RustOptions } from '../RustGenerator';

/**
 * Renderer for Rust's Wrapper types around boolean, numbers or string types
 *
 * @extends NewTypeRenderer
 */
export class NewTypeRenderer extends RustRenderer<ConstrainedMetaModel> {
  public async defaultSelf(): Promise<string> {
    const doc = this.renderComments(
      `${this.model.name} represents a ${this.model.name} model.`
    );
    const structMacro = await this.runStructMacroPreset();
    const additionalContent = await this.runAdditionalContentPreset();
    const field = this.model;
    const wrappedType = await this.runPreset('field', { field });
    return `${doc}
${structMacro}
pub struct ${this.model.name}(pub ${wrappedType});
${additionalContent}
`;
  }

  runStructMacroPreset(): Promise<string> {
    return this.runPreset('structMacro');
  }
}

export const RUST_DEFAULT_NEW_TYPE_PRESET: NewTypePresetType<RustOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  structMacro({ model, renderer }) {
    return renderer.renderMacro(model);
  },
  field({ model }) {
    return model.type;
  }
};
