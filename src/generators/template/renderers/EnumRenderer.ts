import { TemplateRenderer } from '../TemplateRenderer';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../models';
import { EnumPresetType } from '../TemplatePreset';
import { TemplateOptions } from '../TemplateGenerator';

/**
 * Renderer for Template's `enum` type
 *
 * @extends TemplateRenderer
 */
export class EnumRenderer extends TemplateRenderer<ConstrainedEnumModel> {
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

export const TEMPLATE_DEFAULT_ENUM_PRESET: EnumPresetType<TemplateOptions> = {
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
