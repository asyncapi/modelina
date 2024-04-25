import { GoRenderer } from '../GoRenderer';
import { UnionPresetType } from '../GoPreset';
import {
  ConstrainedUnionModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel
} from '../../../models';
import { GoOptions } from '../GoGenerator';
import { FormatHelpers } from '../../../helpers/FormatHelpers';

const unionIncludesDiscriminator = (model: ConstrainedUnionModel): boolean => {
  return (
    !!model.options.discriminator &&
    model.union.every(
      (union) =>
        union instanceof ConstrainedObjectModel ||
        (union instanceof ConstrainedReferenceModel &&
          union.ref instanceof ConstrainedObjectModel)
    )
  );
};

/**
 * Renderer for Go's `struct` type
 *
 * @extends GoRenderer
 */
export class UnionRenderer extends GoRenderer<ConstrainedUnionModel> {
  public async defaultSelf(): Promise<string> {
    const doc = this.renderComments(
      `${this.model.name} represents a ${this.model.name} model.`
    );

    if (unionIncludesDiscriminator(this.model)) {
      const content: string[] = [await this.runDiscriminatorAccessorPreset()];

      return `${doc}
type ${this.model.name} interface {
${this.indent(this.renderBlock(content, 2))}
}`;
    }

    const content = [
      await this.renderFields(),
      await this.runAdditionalContentPreset()
    ];

    return `${doc}
type ${this.model.name} struct {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  async renderFields(): Promise<string> {
    const fields = this.model.union;
    const content: string[] = [];

    for (const field of fields) {
      const renderField = await this.runFieldPreset(field);
      if (!content.includes(renderField)) {
        content.push(renderField);
      }
    }
    return this.renderBlock(content);
  }

  runFieldPreset(field: ConstrainedMetaModel): Promise<string> {
    return this.runPreset('field', { field });
  }

  runDiscriminatorAccessorPreset(): Promise<string> {
    return this.runPreset('discriminator');
  }
}

export const GO_DEFAULT_UNION_PRESET: UnionPresetType<GoOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  field({ field, options }) {
    const fieldType = field.type;

    if (fieldType === 'interface{}') {
      return `${options.unionAnyModelName} ${fieldType}`;
    }
    if (fieldType.includes('map')) {
      return `${options.unionDictModelName} ${fieldType}`;
    }
    if (fieldType.includes('[]')) {
      return `${options.unionArrModelName} ${fieldType}`;
    }
    return `${fieldType}`;
  },
  discriminator({ model }) {
    if (!model.options.discriminator?.discriminator) {
      return '';
    }

    return `Is${FormatHelpers.toPascalCase(
      model.options.discriminator.discriminator
    )}()`;
  }
};
