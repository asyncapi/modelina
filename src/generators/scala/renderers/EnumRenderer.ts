import { ScalaRenderer } from '../ScalaRenderer';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../models';
import { EnumPresetType } from '../ScalaPreset';
import { ScalaOptions } from '../ScalaGenerator';

/**
 * Renderer for Scala's `enum` type
 *
 * @extends ScalaRenderer
 */
export class EnumRenderer extends ScalaRenderer<ConstrainedEnumModel> {
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

export const SCALA_DEFAULT_ENUM_PRESET: EnumPresetType<ScalaOptions> = {
  self({ renderer }) {
    renderer.dependencyManager.addDependency(
      'import com.fasterxml.jackson.annotation.*;'
    );
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
  }
};
