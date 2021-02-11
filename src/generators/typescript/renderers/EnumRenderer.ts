import { TypeScriptRenderer } from "../TypeScriptRenderer";

import { FormatHelpers } from "../../../helpers";
import { EnumPreset } from "../../../models";

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
      const renderedItem = await this.runItemPreset(item);
      items.push(renderedItem);
    }

    return this.renderBlock(items);
  }

  runItemPreset(item: any): Promise<string> {
    return this.runPreset("item", { item });
  }
}

export const TS_DEFAULT_ENUM_PRESET: EnumPreset<EnumRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ item }) {
    return `${FormatHelpers.toConstantCase(`${item}`)} = "${item}",`;
  }
}
