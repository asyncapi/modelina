import { PhpRenderer } from '../PhpRenderer';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../models';
import { EnumPresetType } from '../PhpPreset';
import { PhpOptions } from '../PhpGenerator';

/**
 * Renderer for PHP's `enum` type
 *
 * @extends PhpRenderer
 */
export class EnumRenderer extends PhpRenderer<ConstrainedEnumModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderItems(),
      await this.runAdditionalContentPreset()
    ];
    return `enum ${this.model.name}
{
${this.indent(this.renderBlock(content, 2))}
}
`;
  }

  async renderItems(): Promise<string> {
    const enums = this.model.values || [];
    const items: string[] = [];

    for (const value of enums) {
      const renderedItem = await this.runItemPreset(value);
      items.push(renderedItem);
    }

    return items.join('\n');
  }

  runItemPreset(item: ConstrainedEnumValueModel): Promise<string> {
    return this.runPreset('item', { item });
  }
}

export const PHP_DEFAULT_ENUM_PRESET: EnumPresetType<PhpOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ item }) {
    return `case ${item.key};`;
  }
};
