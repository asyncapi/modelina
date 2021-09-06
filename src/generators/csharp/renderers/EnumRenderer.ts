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
    const enumItems = await this.renderItems();
    const formattedName = this.nameType(this.model.$id);
    const caseItemValues = await this.renderCaseItemValues();
    return `public enum ${formattedName} {
${this.indent(enumItems)}
}
public static class ${formattedName}Extensions {
  public static dynamic GetValue(this ${formattedName} val)
  {
    switch (val)
    {
${this.indent(caseItemValues, 6)}
    }
    return null;
  }
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

    const content = items.join(', ');
    return `${content}`;
  }

  async renderCaseItemValues(): Promise<string> {
    const enums = this.model.enum || [];
    const items: string[] = [];
    const formattedName = this.nameType(this.model.$id);

    for (const enumValue of enums) {
      const renderedItem = await this.runItemPreset(enumValue);
      let value: any;
      switch (typeof enumValue) {
      case 'number':
      case 'bigint':
      case 'boolean':
        value = enumValue;
        break;
      case 'object': 
        value = `"${JSON.stringify(enumValue).replaceAll('"', '\\"')}"`;
        break;
      default:
        value = `"${enumValue}"`;
        break;
      }
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
    let itemName = String(item);
    if (typeof item === 'number' || typeof item === 'bigint') {
      itemName = `Number_${itemName}`;
    } else if (typeof item === 'object') {
      itemName = `${JSON.stringify(item)}`;
    }

    return pascalCase(itemName);
  },
};
