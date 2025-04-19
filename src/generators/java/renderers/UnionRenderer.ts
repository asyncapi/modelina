import { JavaRenderer } from '../JavaRenderer';
import { ConstrainedUnionModel } from '../../../models';
import { JavaOptions } from '../JavaGenerator';
import { UnionPresetType } from '../JavaPreset';
import { FormatHelpers } from '../../../helpers';

/**
 * Renderer for Java's `union` type
 *
 * @extends JavaRenderer
 */
export class UnionRenderer extends JavaRenderer<ConstrainedUnionModel> {
  async defaultSelf(): Promise<string> {
    const doc = this.renderComments(
      `${this.model.name} represents a union of types: ${this.model.union
        .map((m) => m.type)
        .join(', ')}`
    );

    const content = [];

    if (this.model.options.discriminator) {
      content.push(await this.runDiscriminatorGetterPreset());
      content.push(await this.runDiscriminatorSetterPreset());
    }
    content.push(await this.runAdditionalContentPreset());

    return this.renderBlock([
      doc,
      `public interface ${this.model.name} {`,
      this.indent(this.renderBlock(content)),
      '}'
    ]);
  }

  runDiscriminatorGetterPreset(): Promise<string> {
    return this.runPreset('discriminatorGetter');
  }

  runDiscriminatorSetterPreset(): Promise<string> {
    return this.runPreset('discriminatorSetter');
  }
}

export const JAVA_DEFAULT_UNION_PRESET: UnionPresetType<JavaOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  discriminatorGetter({ model }) {
    if (!model.options.discriminator?.type) {
      return '';
    }

    return `${model.options.discriminator.type} get${FormatHelpers.toPascalCase(
      getSanitizedDiscriminatorName(model)
    )}();`;
  },
  discriminatorSetter({ model }) {
    if (!model.options.discriminator?.type) {
      return '';
    }

    return `void set${FormatHelpers.toPascalCase(
      getSanitizedDiscriminatorName(model)
    )}(${model.options.discriminator.type} ${FormatHelpers.toCamelCase(
      getSanitizedDiscriminatorName(model)
    )});`;
  }
};

function getSanitizedDiscriminatorName(model: ConstrainedUnionModel): string {
  return FormatHelpers.replaceSpecialCharacters(
    model.options.discriminator!.discriminator,
    {
      exclude: [' ', '_'],
      separator: '_'
    }
  );
}
