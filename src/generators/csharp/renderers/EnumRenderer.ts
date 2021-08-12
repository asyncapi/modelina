import { CSharpRenderer } from '../CSharpRenderer';
import { EnumPreset } from '../../../models';
import { pascalCase } from 'change-case';

/**
 * Renderer for C#'s `enum` type
 * 
 * @extends CSharpRenderer
 */
export class EnumRenderer extends CSharpRenderer {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderItems(),
    ];
    const formattedName = this.nameType(this.model.$id);
    return `public enum ${formattedName} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  async renderItems(): Promise<string> {
    const enums = this.model.enum || [];
    const items: string[] = [];

    for (const value of enums) {
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

export const CSHARP_DEFAULT_ENUM_PRESET: EnumPreset<EnumRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ item }) {
    let itemName = String(item);
    if (typeof item === 'number') {
      itemName = `Number_${itemName}`;
    }
    return pascalCase(itemName);
  },
};
