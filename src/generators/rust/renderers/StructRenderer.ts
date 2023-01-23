import { RustRenderer } from '../RustRenderer';
import { StructPresetType } from '../RustPreset';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel
} from '../../../models';
import { RustOptions } from '../RustGenerator';

/**
 * Renderer for Rust `struct` type
 *
 * @extends RustRenderer
 */
export class StructRenderer extends RustRenderer<ConstrainedObjectModel> {
  public async defaultSelf(): Promise<string> {
    const content = [await this.renderFields()];

    const structMacro = await this.runStructMacroPreset();

    const doc = this.renderComments(
      `${this.model.name} represents a ${this.model.name} model.`
    );
    const additionalContent = await this.runAdditionalContentPreset();
    return `${doc}
${structMacro}
pub struct ${this.model.name} {
${this.indent(this.renderBlock(content))}
}
${additionalContent}`;
  }

  async renderFields(): Promise<string> {
    const fields = this.model.properties;
    const content: string[] = [];

    for (const field of Object.values(fields)) {
      const renderFieldMacro = await this.runFieldMacroPreset(field);
      content.push(renderFieldMacro);
      const renderField = await this.runFieldPreset(field);
      content.push(renderField);
    }
    return this.renderBlock(content);
  }

  runStructMacroPreset(): Promise<string> {
    return this.runPreset('structMacro');
  }
  runFieldMacroPreset(field: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('fieldMacro', { field });
  }

  runFieldPreset(field: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('field', { field });
  }
}

export const RUST_DEFAULT_STRUCT_PRESET: StructPresetType<RustOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  structMacro({ model, renderer }) {
    return renderer.renderMacro(model);
  },

  fieldMacro({ field }) {
    const serdeArgs: string[] = [];
    serdeArgs.push(`rename="${field.unconstrainedPropertyName}"`);
    if (!field.required) {
      serdeArgs.push('skip_serializing_if = "Option::is_none"');
    }
    return `#[serde(${serdeArgs.join(', ')})]`;
  },
  field({ field }) {
    let fieldType = field.property.type;
    if (field.property instanceof ConstrainedReferenceModel) {
      fieldType = `Box<crate::${fieldType}>`;
    }
    if (!field.required) {
      fieldType = `Option<${fieldType}>`;
    }
    return `pub ${field.propertyName}: ${fieldType},`;
  }
};
