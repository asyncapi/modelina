import { JavaRenderer } from '../JavaRenderer';

import { CommonModel, EnumPreset } from '../../../models';
import { FormatHelpers } from '../../../helpers';

/**
 * Renderer for Java's `enum` type
 * 
 * @extends JavaRenderer
 */
export class EnumRenderer extends JavaRenderer {
  async defaultSelf(): Promise<string> {
    const enumName = this.model.$id;
    const type = Array.isArray(this.model.type) ? 'Object' : this.model.type!;
    const classType = this.toClassType(this.toJavaType(type, this.model));

    return `public enum ${enumName} {
${this.indent(await this.renderItems())};

${this.indent(this.renderHelpers(enumName!, classType))}
}`;
  }

  async renderItems(): Promise<string> {
    const enums = this.model.enum || [];
    const items: string[] = [];

    for (const value of enums) {
      const renderedItem = await this.runItemPreset(value, this.model);
      items.push(renderedItem);
    }

    return items.join(', ');
  }

  normalizeKey(value: any): string {
    switch (typeof value) {
    case 'bigint':
    case 'number': {
      return FormatHelpers.toConstantCase(`number ${value}`);
    }
    case 'boolean': {
      return FormatHelpers.toConstantCase(`boolean ${value}`);
    }
    default: return FormatHelpers.toConstantCase(value);
    }
  }

  normalizeValue(value: any): string {
    switch (typeof value) {
    case 'string': {
      return `"${value}"`;
    }
    default: return `${value}`;
    }
  }

  renderHelpers(enumName: string, classType: string): string {
    return `private ${classType} value;
    
${enumName}(${classType} value) {
  this.value = value;
}
    
@JsonValue
public ${classType} getValue() {
  return value;
}

@Override
public String toString() {
  return String.valueOf(value);
}

@JsonCreator
public static ${enumName} fromValue(${classType} value) {
  for (${enumName} e : ${enumName}.values()) {
    if (e.value.equals(value)) {
      return e;
    }
  }
  throw new IllegalArgumentException("Unexpected value '" + value + "'");
}`;
  }

  async runItemPreset(item: any, parentModel: CommonModel): Promise<string> {
    return this.runPreset('item', { item, parentModel });
  }
}

export const JAVA_DEFAULT_ENUM_PRESET: EnumPreset<EnumRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ renderer, item }) {
    const key = renderer.normalizeKey(item);
    const value = renderer.normalizeValue(item);
    return `${key}(${value})`;
  },
};
