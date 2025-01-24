import { GoRenderer } from '../GoRenderer';
import { StructPresetType } from '../GoPreset';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel,
  ConstrainedUnionModel
} from '../../../models';
import { GoOptions } from '../GoGenerator';
import { FormatHelpers } from '../../../helpers/FormatHelpers';

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

    if (this.model.options.parents?.length) {
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
    if (
      field.property instanceof ConstrainedReferenceModel &&
      !(
        field.property.ref instanceof ConstrainedUnionModel &&
        field.property.ref.options.discriminator
      )
    ) {
      fieldType = `*${fieldType}`;
    }
    return `${field.propertyName} ${fieldType}`;
  },
  discriminator({ model }) {
    const { parents } = model.options;

    if (!parents?.length) {
      return '';
    }

    return parents
      .map((parent) => {
        if (!parent.options.discriminator) {
          return undefined;
        }

        return `func (r ${model.name}) Is${FormatHelpers.toPascalCase(
          parent.name
        )}${FormatHelpers.toPascalCase(
          parent.options.discriminator.discriminator
        )}() {}`;
      })
      .filter((parent) => !!parent)
      .join('\n\n');
  }
};
