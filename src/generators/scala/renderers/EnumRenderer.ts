import { ScalaRenderer } from '../ScalaRenderer';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../models';
import { EnumPresetType } from '../ScalaPreset';
import { ScalaOptions } from '../ScalaGenerator';
import { FormatHelpers } from 'helpers';

/**
 * Renderer for Scala's `enum` type
 *
 * @extends ScalaRenderer
 */
export class EnumRenderer extends ScalaRenderer<ConstrainedEnumModel> {
  async defaultSelf(valueType: string): Promise<string> {
    const content = [
      await this.renderItems(),
      await this.runFromValuePreset(),
      await this.runAdditionalContentPreset()
    ];
    return `object ${this.model.name}  extends Enumeration {
  type ${this.model.name} = Value

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

    const content = items.join('\n');
    return `${content};`;
  }

  runItemPreset(item: ConstrainedEnumValueModel): Promise<string> {
    return this.runPreset('item', { item });
  }

  runFromValuePreset(): Promise<string> {
    return this.runPreset('fromValue');
  }
}

export const SCALA_DEFAULT_ENUM_PRESET: EnumPresetType<ScalaOptions> = {
  self({ renderer, model }) {
    return renderer.defaultSelf(model.type);
  },
  item({ item }) {
    const key = FormatHelpers.toPascalCase(item.key);

    return `val ${key} = Value("${item.value}")`
  }
};
