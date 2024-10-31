import { CSharpRenderer } from '../CSharpRenderer';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../models';
import { EnumPresetType } from '../CSharpPreset';
import { CSharpOptions } from '../CSharpGenerator';

/**
 * Renderer for C#'s `enum` type
 *
 * @extends CSharpRenderer
 */
export class EnumRenderer extends CSharpRenderer<ConstrainedEnumModel> {
  async defaultSelf(): Promise<string> {
    const enumItems = await this.renderItems();
    const extension = await this.runExtensionPreset();

    return `public enum ${this.model.name}
{
${this.indent(enumItems)}
}
${this.indent(extension)}
`;
  }
  async renderItems(): Promise<string> {
    const enums = this.model.values || [];
    const items: string[] = [];

    for (const value of enums) {
      const renderedItem = await this.runItemPreset(value);
      items.push(renderedItem);
    }

    const content = items.join(',\n');
    return `${content}`;
  }

  toEnumCaseItemValues(): string {
    const enums = this.model.values || [];
    const items: string[] = [];

    for (const enumValue of enums) {
      items.push(
        `case ${enumValue.value}: return ${this.model.name}.${enumValue.key};`
      );
    }

    const content = items.join('\n');
    return `${content}`;
  }
  getValueCaseItemValues(): string {
    const enums = this.model.values || [];
    const items: string[] = [];

    for (const enumValue of enums) {
      items.push(
        `case ${this.model.name}.${enumValue.key}: return ${enumValue.value};`
      );
    }

    const content = items.join('\n');
    return `${content}`;
  }

  runItemPreset(item: ConstrainedEnumValueModel): Promise<string> {
    return this.runPreset('item', { item });
  }
  runExtensionPreset(): Promise<string> {
    return this.runPreset('extension');
  }
  runExtensionMethodsPreset(): Promise<string> {
    return this.runPreset('extensionMethods');
  }
}

export const CSHARP_DEFAULT_ENUM_PRESET: EnumPresetType<CSharpOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ item }) {
    return item.key;
  },
  async extension({ renderer, model }) {
    const extensionMethods = await renderer.runExtensionMethodsPreset();
    return `public static class ${model.name}Extensions
{
${renderer.indent(extensionMethods)}
}`;
  },
  extensionMethods({ model, renderer }) {
    const getValueCaseItemValues = renderer.getValueCaseItemValues();
    const toEnumCaseItemValues = renderer.toEnumCaseItemValues();
    const enumValueSwitch = `switch (enumValue)
{
${renderer.indent(getValueCaseItemValues)}
}
return null;`;
    const valueSwitch = `switch (value)
{
${renderer.indent(toEnumCaseItemValues)}
}
return null;`;
    return `public static ${model.type}? GetValue(this ${model.name} enumValue)
{
${renderer.indent(enumValueSwitch)}
}

public static ${model.name}? To${model.name}(dynamic? value)
{
${renderer.indent(valueSwitch)}
}`;
  }
};
