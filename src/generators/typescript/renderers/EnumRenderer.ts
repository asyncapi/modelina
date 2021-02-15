import { TypeScriptRenderer } from '../TypeScriptRenderer';

import { CommonModel, EnumPreset } from '../../../models';
import { FormatHelpers } from '../../../helpers';

/**
 * Renderer for TypeScript's `enum` type
 * 
 * @extends TypeScriptRenderer
 */
export class EnumRenderer extends TypeScriptRenderer {
  async defaultSelf(): Promise<string> {
    return `enum ${this.model.$id} {
${this.indent(await this.renderItems())}
}`;
  }

  async renderItems(): Promise<string> {
    const enums = this.model.enum || [];
    const items: string[] = [];

    for (const item of enums) {
      const renderedItem = await this.runItemPreset(item, this.model);
      items.push(renderedItem);
    }

    return this.renderBlock(items);
  }

  runItemPreset(item: any, parentModel: CommonModel): Promise<string> {
    return this.runPreset('item', { item, parentModel });
  }
}

export const TS_DEFAULT_ENUM_PRESET: EnumPreset<EnumRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ item }) {
    return `${FormatHelpers.toConstantCase(`${item}`)} = "${item}",`;
  }
};
