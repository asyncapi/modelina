import { JavaRenderer } from '../JavaRenderer';
import { ConstrainedEnumModel} from '../../../models';
import { EnumPresetType } from '../JavaPreset';
import { JavaOptions } from '../JavaGenerator';

/**
 * Renderer for Java's `enum` type
 *
 * @extends JavaRenderer
 */
export class EnumRenderer extends JavaRenderer<ConstrainedEnumModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderItems(),
      await this.runCtorPreset(),
      await this.runGetValuePreset(),
      await this.runFromValuePreset(),
      await this.runAdditionalContentPreset()
    ];
    return `public enum ${this.model.name} {
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

    const content = items.join(', ');
    return `${content};`;
  }

  runItemPreset(item: any): Promise<string> {
    return this.runPreset('item', {item});
  }

  runCtorPreset(): Promise<string> {
    return this.runPreset('ctor');
  }

  runGetValuePreset(): Promise<string> {
    return this.runPreset('getValue');
  }

  runFromValuePreset(): Promise<string> {
    return this.runPreset('fromValue');
  }
}

export const JAVA_DEFAULT_ENUM_PRESET: EnumPresetType<JavaOptions> = {
  self({renderer}) {
    return renderer.defaultSelf();
  },
  item({ item }) {
    return `${item.key}(${item.value})`;
  },
  ctor({ model }) {
    const enumValueType = 'Object';
    return `private ${enumValueType} value;

${model.type}(${enumValueType} value) {
  this.value = value;
}`;
  },
  getValue() {
    const enumValueType = 'Object';
    return `public ${enumValueType} getValue() {
  return value;
}`;
  },
  fromValue({ model }) {
    const enumValueType = 'Object';
    return `public static ${model.type} fromValue(${enumValueType} value) {
  for (${model.type} e : ${model.type}.values()) {
    if (e.value.equals(value)) {
      return e;
    }
  }
  throw new IllegalArgumentException("Unexpected value '" + value + "'");
}`;
  },
  additionalContent() {
    return `@Override
public String toString() {
  return String.valueOf(value);
}`;
  }
};
