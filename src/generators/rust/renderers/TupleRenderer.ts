import { RustRenderer } from '../RustRenderer';
import {
  ConstrainedTupleModel,
  ConstrainedTupleValueModel
} from '../../../models';
import { TuplePresetType } from '../RustPreset';
import { RustOptions } from '../RustGenerator';

/**
 * Renderer for Rust's `Tuple` type
 *
 * @extends TupleRenderer
 */
export class TupleRenderer extends RustRenderer<ConstrainedTupleModel> {
  public async defaultSelf(): Promise<string> {
    const doc = this.renderComments(
      `${this.model.name} represents a ${this.model.name} model.`
    );
    const structMacro = await this.runStructMacroPreset();
    const additionalContent = await this.runAdditionalContentPreset();
    const fields = await this.renderFields();
    return `${doc}
${structMacro}
pub struct ${this.model.name}(${fields});
${additionalContent}
`;
  }

  async renderFields(): Promise<string> {
    const fields = this.model.tuple;
    const content: string[] = [];

    for (const field of Object.values(fields)) {
      const renderField = await this.runFieldPreset(field);
      content.push(renderField);
    }
    return content.join(', ');
  }

  runStructMacroPreset(): Promise<string> {
    return this.runPreset('structMacro');
  }
  runFieldPreset(field: ConstrainedTupleValueModel): Promise<string> {
    return this.runPreset('field', { field });
  }
}

export const RUST_DEFAULT_TUPLE_PRESET: TuplePresetType<RustOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  structMacro({ model, renderer }) {
    return renderer.renderMacro(model);
  },
  field({ field }) {
    return field.value.type;
  }
};
