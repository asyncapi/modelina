import { TypeScriptRenderer } from '../TypeScriptRenderer';

import { EnumPreset } from '../../../models';
import { FormatHelpers } from '../../../helpers';

/**
 * Renderer for TypeScript's `enum` type
 * 
 * @extends TypeScriptRenderer
 */
export class EnumRenderer extends TypeScriptRenderer {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderItems(),
      await this.runAdditionalContentPreset()
    ];

    const formattedName = this.nameType(this.model.$id);
    return `enum ${formattedName} {
${this.indent(this.renderBlock(content, 2))}
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
    return this.runPreset('item', { item });
  }

  normalizeKey(value: any): any {
    let key;
    switch (typeof value) {
    case 'bigint':
    case 'number': {
      key = `number_${value}`;
      break;
    }
    case 'object': {
      key = JSON.stringify(value);
      break;
    }
    default: {
      key = FormatHelpers.replaceSpecialCharacters(String(value), { exclude: [' '], separator: '_' });
      //Ensure no special char can be the beginning letter 
      if (!(/^[a-zA-Z]+$/).test(key.charAt(0))) {
        key = `String_${key}`;
      }
    }
    }
    return FormatHelpers.toConstantCase(key);
  }

  normalizeValue(value: any): any {
    let normalizedValue;
    switch (typeof value) {
    case 'string':
    case 'boolean':
      normalizedValue = `"${value}"`;
      break;
    case 'bigint':
    case 'number': {
      normalizedValue = value;
      break;
    }
    case 'object': {
      normalizedValue = `'${JSON.stringify(value)}'`;
      break;
    }
    default: {
      normalizedValue = String(value);
    }
    }
    return normalizedValue;
  }
}

export const TS_DEFAULT_ENUM_PRESET: EnumPreset<EnumRenderer> = {
  async self({ renderer }) {
    return `export ${await renderer.defaultSelf()}`;
  },
  item({ item, renderer }): string {
    const key = renderer.normalizeKey(item);
    const value = renderer.normalizeValue(item);
    return `${key} = ${value},`;
  }
};
