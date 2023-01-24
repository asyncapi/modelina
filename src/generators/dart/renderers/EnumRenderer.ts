import { DartRenderer } from '../DartRenderer';
import { ConstrainedEnumModel } from '../../../models';
import { EnumPresetType } from '../DartPreset';
import { DartOptions } from '../DartGenerator';

/**
 * Renderer for Dart's `enum` type
 *
 * @extends DartRenderer
 */
export class EnumRenderer extends DartRenderer<ConstrainedEnumModel> {
  async defaultSelf(): Promise<string> {
    const content = [await this.renderItems()];
    return `enum ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  async renderItems(): Promise<string> {
    const items: string[] = [];

    for (const value of this.model.values) {
      const renderedItem = await this.runItemPreset(value);
      items.push(renderedItem);
    }

    const content = items.join(', ');
    return `${content}`;
  }
  runItemPreset(item: any): Promise<string> {
    return this.runPreset('item', { item });
  }
}

export const DART_DEFAULT_ENUM_PRESET: EnumPresetType<DartOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ item }) {
    return `${item.value}`;
  }
};
