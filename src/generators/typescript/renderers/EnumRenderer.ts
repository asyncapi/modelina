import { TypeScriptRenderer } from '../TypeScriptRenderer';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../models';
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

  renderUnionEnum(model: ConstrainedEnumModel): string {
    const enums = model.values || [];
    const enumTypes = enums.map((t) => t.value).join(' | ');
    return `type ${model.name} = ${enumTypes};`;
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

  runItemPreset(item: ConstrainedEnumValueModel): Promise<string> {
    return this.runPreset('item', { item });
  }
}

export const TS_DEFAULT_ENUM_PRESET: EnumPresetType<TypeScriptOptions> = {
  self({ renderer, options, model }) {
    if (options.enumType === 'union' && model instanceof ConstrainedEnumModel) {
      return renderer.renderUnionEnum(model);
    }
    return renderer.defaultSelf();
  },
  item({ item }): string {
    return `${item.key} = ${item.value},`;
  }
};
