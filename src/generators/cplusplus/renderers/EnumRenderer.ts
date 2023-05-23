import { CplusplusRenderer } from '../CplusplusRenderer';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel,
  ConstrainedIntegerModel
} from '../../../models';
import { EnumPresetType } from '../CplusplusPreset';
import { CplusplusOptions } from '../CplusplusGenerator';

/**
 * Renderer for Cplusplus's `enum` type
 *
 * @extends CplusplusRenderer
 */
export class EnumRenderer extends CplusplusRenderer<ConstrainedEnumModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderItems(),
      await this.runAdditionalContentPreset()
    ];
    return `enum class ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
};`;
  }

  async renderItems(): Promise<string> {
    const enums = this.model.values || [];
    const items: string[] = [];

    for (const value of enums) {
      const renderedItem = await this.runItemPreset(value);
      items.push(renderedItem);
    }

    const content = items.join(', ');
    return `${content}`;
  }

  runItemPreset(item: ConstrainedEnumValueModel): Promise<string> {
    return this.runPreset('item', { item });
  }
}

export const CPLUSPLUS_DEFAULT_ENUM_PRESET: EnumPresetType<CplusplusOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ item }) {
    if (item.value instanceof ConstrainedIntegerModel) {
      return `${item.key} = ${item.value}`;
    }
    return `${item.key}`;
  }
};
