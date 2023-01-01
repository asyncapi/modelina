import { CppRenderer } from '../CppRenderer';
import { ConstrainedEnumModel, ConstrainedEnumValueModel} from '../../../models';
import { EnumPresetType } from '../CppPreset';
import { CppOptions } from '../CppGenerator';

/**
 * Renderer for Cpp's `enum` type
 * 
 * @extends CppRenderer
 */
export class EnumRenderer extends CppRenderer<ConstrainedEnumModel> {
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

export const CPP_DEFAULT_ENUM_PRESET: EnumPresetType<CppOptions> = {
  self({ renderer }) {
    renderer.addDependency('import com.fasterxml.jackson.annotation.*;');
    return renderer.defaultSelf();
  },
  item({ item }) {
    return `${item.key}(${item.value})`;
  },
  additionalContent({ model }) {
    const enumValueType = 'Object';

    return `private ${enumValueType} value;

${model.type}(${enumValueType} value) {
  this.value = value;
}

@JsonValue
public ${enumValueType} getValue() {
  return value;
}

@Override
public String toString() {
  return String.valueOf(value);
}

@JsonCreator
public static ${model.type} fromValue(${enumValueType} value) {
  for (${model.type} e : ${model.type}.values()) {
    if (e.value.equals(value)) {
      return e;
    }
  }
  throw new IllegalArgumentException("Unexpected value '" + value + "'");
}`;
  },
};
