import { CSharpRenderer } from '../CSharpRenderer';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../models';
import { EnumPresetType } from '../CSharpPreset';
import { CSharpOptions } from '../CSharpGenerator';

/**
 * Renderer for C#'s `enum` type
 *
 * @extends CSharpRenderer
 */
export class EnumRenderer extends CSharpRenderer<ConstrainedEnumModel> {
  async defaultSelf(): Promise<string> {
    const enumItems = await this.renderItems();
    const getValueCaseItemValues = this.getValueCaseItemValues();
    const toEnumCaseItemValues = this.toEnumCaseItemValues();
    const enumValueSwitch = `switch (enumValue)
{
${this.indent(getValueCaseItemValues)}
}
return null;`;
    const valueSwitch = `switch (value.ToString())
{
${this.indent(toEnumCaseItemValues)}
}
return null;`;
    const classContent = `public static ${this.model.type}? GetValue(this ${
      this.model.name
    } enumValue)
{
${this.indent(enumValueSwitch)}
}

public static ${this.model.name}? To${this.model.name}(dynamic? value)
{
${this.indent(valueSwitch)}
}`;

    return `public enum ${this.model.name}
{
${this.indent(enumItems)}
}

public static class ${this.model.name}Extensions
{
${this.indent(classContent)}
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

    const content = items.join(',\n');
    return `${content}`;
  }

  toEnumCaseItemValues(): string {
    const enums = this.model.values || [];
    const items: string[] = [];

    for (const enumValue of enums) {
      items.push(
        `case ${enumValue.value}: return ${this.model.name}.${enumValue.key};`
      );
    }

    const content = items.join('\n');
    return `${content}`;
  }
  getValueCaseItemValues(): string {
    const enums = this.model.values || [];
    const items: string[] = [];

    for (const enumValue of enums) {
      items.push(
        `case ${this.model.name}.${enumValue.key}: return ${enumValue.value};`
      );
    }

    const content = items.join('\n');
    return `${content}`;
  }

  runItemPreset(item: ConstrainedEnumValueModel): Promise<string> {
    return this.runPreset('item', { item });
  }
}

export const CSHARP_DEFAULT_ENUM_PRESET: EnumPresetType<CSharpOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ item }) {
    return item.key;
  }
};
