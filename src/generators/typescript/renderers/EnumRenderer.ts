import { TypeScriptRenderer } from '../TypeScriptRenderer';
import { ConstrainedEnumModel } from '../../../models';
import { EnumPresetType } from '../TypeScriptPreset';
import { TypeScriptOptions } from '../TypeScriptGenerator';

/**
 * Renderer for TypeScript's `enum` type
 * 
 * @extends TypeScriptRenderer
 */
export class EnumRenderer extends TypeScriptRenderer<ConstrainedEnumModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderItems(),
      await this.runAdditionalContentPreset()
    ];

    return `enum ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  async renderItems(): Promise<string> {
    const enums = this.model.values || [];
    const items: string[] = [];

    for (const item of enums) {
      const renderedItem = await this.runItemPreset(item);
      items.push(renderedItem);
    }

    return this.renderBlock(items);
  }

  runItemPreset(item: any): Promise<string> {
    return this.runPreset('item', { item });
  }
}

export const TS_DEFAULT_ENUM_PRESET: EnumPresetType<TypeScriptOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ item }): string {
    return `${item.key} = ${item.value},`;
  }
};
