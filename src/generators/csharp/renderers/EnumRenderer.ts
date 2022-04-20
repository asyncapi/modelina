import { CSharpRenderer } from '../CSharpRenderer';
import { EnumPreset } from '../../../models';
import { pascalCase } from 'change-case';
import { FormatHelpers } from '../../../helpers';

/**
 * Renderer for C#'s `enum` type
 * 
 * @extends CSharpRenderer
 */
export class EnumRenderer extends CSharpRenderer {
  async defaultSelf(): Promise<string> {
    const enumItems = await this.renderItems();
    const formattedName = this.nameType(this.model.$id);
    const getValueCaseItemValues = await this.getValueCaseItemValues();
    const toEnumCaseItemValues = await this.toEnumCaseItemValues();
    return `public enum ${formattedName}
{
${this.indent(enumItems)}
}

public static class ${formattedName}Extensions
{
${this.indent(`public static dynamic GetValue(this ${formattedName} enumValue)
{
${this.indent(`switch (enumValue)
{
${this.indent(getValueCaseItemValues)}
}
return null;`)}
}

public static ${formattedName}? To${formattedName}(dynamic value)
{
${this.indent(`switch (value)
{
${this.indent(toEnumCaseItemValues)}
}
return null;`)}
}`)}
}
`;
  }

  async renderItems(): Promise<string> {
    const enums = this.model.enum || [];
    const items: string[] = [];

    for (const value of enums) {
      const renderedItem = await this.runItemPreset(value);
      items.push(renderedItem);
    }

    const content = items.join(',\n');
    return `${content}`;
  }

  /**
   * Some enum values require custom value conversion
   */
  getEnumValue(enumValue: any): any {
    switch (typeof enumValue) {
      case 'number':
      case 'bigint':
      case 'boolean':
        return enumValue;
      case 'object':
        return `"${JSON.stringify(enumValue).replace(/"/g, '\\"')}"`;
      default:
        return `"${enumValue}"`;
    }
  }

  async toEnumCaseItemValues(): Promise<string> {
    const enums = this.model.enum || [];
    const items: string[] = [];
    const formattedName = this.nameType(this.model.$id);

    for (const enumValue of enums) {
      const renderedItem = await this.runItemPreset(enumValue);
      const value = this.getEnumValue(enumValue);
      items.push(`case ${value}: return ${formattedName}.${renderedItem};`);
    }

    const content = items.join('\n');
    return `${content}`;
  }
  async getValueCaseItemValues(): Promise<string> {
    const enums = this.model.enum || [];
    const items: string[] = [];
    const formattedName = this.nameType(this.model.$id);

    for (const enumValue of enums) {
      const renderedItem = await this.runItemPreset(enumValue);
      const value = this.getEnumValue(enumValue);
      items.push(`case ${formattedName}.${renderedItem}: return ${value};`);
    }

    const content = items.join('\n');
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
    let itemName = FormatHelpers.replaceSpecialCharacters(String(item), { exclude: [' '], separator: '_' });
    if (typeof item === 'number' || typeof item === 'bigint') {
      itemName = `Number_${itemName}`;
    } else if (typeof item === 'object') {
      itemName = `${JSON.stringify(item)}`;
    } else if (!(/^[a-zA-Z]+$/).test(itemName.charAt(0))) {
      itemName = `String_${itemName}`;
    }

    return pascalCase(itemName);
  },
};
