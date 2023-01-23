import { KotlinRenderer } from '../KotlinRenderer';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../models';
import { EnumPresetType } from '../KotlinPreset';
import { KotlinOptions } from '../KotlinGenerator';

/**
 * Renderer for Kotlin's `enum` type
 *
 * @extends KotlinRenderer
 */
export class EnumRenderer extends KotlinRenderer<ConstrainedEnumModel> {
  async defaultSelf(valueType: string): Promise<string> {
    const content = [
      await this.renderItems(),
      await this.runFromValuePreset(),
      await this.runAdditionalContentPreset()
    ];
    return `enum class ${this.model.name}(val value: ${valueType}) {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  async renderItems(): Promise<string> {
    const enums = this.model.values || [];
    const items: string[] = [];

    for (const value of enums) {
      const renderedItem = await this.runItemPreset(value);
      items.push(renderedItem);
    }

    const content = items.join(', \n');
    return `${content};`;
  }

  runItemPreset(item: ConstrainedEnumValueModel): Promise<string> {
    return this.runPreset('item', { item });
  }

  runFromValuePreset(): Promise<string> {
    return this.runPreset('fromValue');
  }
}

export const KOTLIN_DEFAULT_ENUM_PRESET: EnumPresetType<KotlinOptions> = {
  self({ renderer, model }) {
    return renderer.defaultSelf(model.type);
  },
  item({ item }) {
    return `${item.key}(${item.value})`;
  }
};
