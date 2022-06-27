import { JavaRenderer } from '../JavaRenderer';
import { ConstrainedEnumModel, ConstrainedEnumValueModel} from '../../../models';
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

  runItemPreset(item: ConstrainedEnumValueModel): Promise<string> {
    return this.runPreset('item', { item });
  }
}

export const JAVA_DEFAULT_ENUM_PRESET: EnumPresetType<JavaOptions> = {
  self({ renderer }) {
    renderer.addDependency('import com.fasterxml.jackson.annotation.*;');
    return renderer.defaultSelf();
  },
  item({ item }) {
    return `${item.key}(${item.value})`;
  },
  additionalContent({ model }) {
    return `private ${model.type} value;

${model.type}(${model.type} value) {
  this.value = value;
}
    
@JsonValue
public ${model.type} getValue() {
  return value;
}

@Override
public String toString() {
  return String.valueOf(value);
}

@JsonCreator
public static ${model.type} fromValue(${model.type} value) {
  for (${model.type} e : ${model.type}.values()) {
    if (e.value.equals(value)) {
      return e;
    }
  }
  throw new IllegalArgumentException("Unexpected value '" + value + "'");
}`;
  },
};
