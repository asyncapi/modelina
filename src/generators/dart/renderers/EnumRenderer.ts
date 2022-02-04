import { DartRenderer } from '../DartRenderer';
import { EnumPreset} from '../../../models';
import { FormatHelpers } from '../../../helpers';

/**
 * Renderer for Dart's `enum` type
 * 
 * @extends DartRenderer
 */
export class EnumRenderer extends DartRenderer {
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

    for (const value of enums) {
      const renderedItem = await this.runItemPreset(value);
      items.push(renderedItem);
    }

    const content = items.join(', ');
    return `${content};`;
  }

  normalizeKey(value: any): string {
    let key;
    switch (typeof value) {
    case 'bigint':
    case 'number': {
      key = `number_${value}`;
      break;
    }
    case 'boolean': {
      key = `boolean_${value}`;
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
        key = `string_${key}`;
      }
    }
    }
    return FormatHelpers.toConstantCase(key);
  }

  normalizeValue(value: any): string {
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    if (typeof value === 'object') {
      return `"${JSON.stringify(value).replace(/"/g, '\\"')}"`;
    }
    return String(value);
  }

  runItemPreset(item: any): Promise<string> {
    return this.runPreset('item', { item });
  }
}

export const DART_DEFAULT_ENUM_PRESET: EnumPreset<EnumRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ renderer, item }) {
    //const key = renderer.normalizeKey(item);
    const value = renderer.normalizeValue(item);
    return `${value}`;
  },
//   additionalContent({ renderer, model }) {
//     const enumName = renderer.nameType(model.$id);
//     const type = Array.isArray(model.type) ? 'Object' : model.type;
//     const classType = renderer.toClassType(renderer.toDartType(type, model));
//
//     return `private ${classType} value;
//
// ${enumName}(${classType} value) {
//   this.value = value;
// }`;
//   },
};
