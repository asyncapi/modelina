import { JavaRenderer } from '../JavaRenderer';
import { EnumPreset} from '../../../models';
import { FormatHelpers } from '../../../helpers';

/**
 * Renderer for Java's `enum` type
 * 
 * @extends JavaRenderer
 */
export class EnumRenderer extends JavaRenderer {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderItems(),
      await this.runAdditionalContentPreset()
    ];
    const formattedName = this.nameType(this.model.$id);
    return `public enum ${formattedName} {
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
      key = String(value);
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

export const JAVA_DEFAULT_ENUM_PRESET: EnumPreset<EnumRenderer> = {
  self({ renderer }) {
    renderer.addDependency('import com.fasterxml.jackson.annotation.*;');
    return renderer.defaultSelf();
  },
  item({ renderer, item }) {
    const key = renderer.normalizeKey(item);
    const value = renderer.normalizeValue(item);
    return `${key}(${value})`;
  },
  additionalContent({ renderer, model }) {
    const enumName = renderer.nameType(model.$id);
    const type = Array.isArray(model.type) ? 'Object' : model.type;
    const classType = renderer.toClassType(renderer.toJavaType(type, model));

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
  },
};
