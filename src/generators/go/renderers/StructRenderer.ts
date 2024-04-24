import { GoRenderer } from '../GoRenderer';
import { StructPresetType } from '../GoPreset';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel
} from '../../../models';
import { GoOptions } from '../GoGenerator';
import { FormatHelpers } from '../../../index';

/**
 * Renderer for Go's `struct` type
 *
 * @extends GoRenderer
 */
export class StructRenderer extends GoRenderer<ConstrainedObjectModel> {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderFields(),
      await this.runAdditionalContentPreset()
    ];

    const doc = this.renderComments(
      `${this.model.name} represents a ${this.model.name} model.`
    );

    let discriminator = '';

    if (
      this.model.options.parents?.length &&
      this.model.options.discriminator?.discriminator
    ) {
      discriminator = await this.runDiscriminatorFuncPreset();
    }

    return `${doc}
type ${this.model.name} struct {
${this.indent(this.renderBlock(content, 2))}
}${
      discriminator &&
      `

${discriminator}
`
    }`;
  }

  async renderFields(): Promise<string> {
    const fields = this.model.properties || {};
    const content: string[] = [];

    for (const field of Object.values(fields)) {
      const renderField = await this.runFieldPreset(field);
      content.push(renderField);
    }
    return this.renderBlock(content);
  }

  runFieldPreset(field: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('field', { field });
  }

  runDiscriminatorFuncPreset(): Promise<string> {
    return this.runPreset('discriminator');
  }
}

export const GO_DEFAULT_STRUCT_PRESET: StructPresetType<GoOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  field({ field }) {
    let fieldType = field.property.type;
    if (field.property instanceof ConstrainedReferenceModel) {
      fieldType = `*${fieldType}`;
    }
    return `${field.propertyName} ${fieldType}`;
  },
  discriminator({ model }) {
    if (!model.options.discriminator?.discriminator) {
      return '';
    }

    return `func (serdp ${model.name}) Is${FormatHelpers.toPascalCase(
      model.options.discriminator.discriminator
    )}() bool {
  return true
}`;
  }
};
