import { GoRenderer } from '../GoRenderer';
import { UnionPresetType } from '../GoPreset';
import {
  ConstrainedUnionModel,
  ConstrainedMetaModel,
} from '../../../models';
import { GoOptions } from '../GoGenerator';

/**
 * Renderer for Go's `struct` type
 *
 * @extends GoRenderer
 */
export class UnionRenderer extends GoRenderer<ConstrainedUnionModel> {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderFields(),
      await this.runAdditionalContentPreset()
    ];

    const doc = this.renderComments(
      `${this.model.name} represents a ${this.model.name} model.`
    );

    return `${doc}
type ${this.model.name} struct {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  async renderFields(): Promise<string> {
    const fields = this.model.union || {};
    const content: string[] = [];

    for (const field of fields) {
      const renderField = await this.runFieldPreset(field);
      content.push(renderField);
    }
    return this.renderBlock(content);
  }

  runFieldPreset(field: ConstrainedMetaModel): Promise<string> {
    return this.runPreset('field', { field });
  }
}

export const GO_DEFAULT_UNION_PRESET: UnionPresetType<GoOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  field({ field }) {
    let fieldType = field.type
    return `${fieldType}`;
  }
};
