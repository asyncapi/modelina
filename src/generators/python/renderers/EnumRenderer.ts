import { PythonRenderer } from '../PythonRenderer';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../models';
import { EnumPresetType } from '../PythonPreset';
import { PythonOptions } from '../PythonGenerator';

/**
 * Renderer for Python's `enum` type
 *
 * @extends PythonRenderer
 */
export class EnumRenderer extends PythonRenderer<ConstrainedEnumModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderItems(),
      await this.runAdditionalContentPreset()
    ];

    return `class ${this.model.name}(Enum): 
${this.indent(this.renderBlock(content, 2), 2)}`;
  }

  async renderItems(): Promise<string> {
    const enums = this.model.values || [];
    const items: string[] = [];

    for (const value of enums) {
      const renderedItem = await this.runItemPreset(value);
      items.push(renderedItem);
    }

    const content = items.join('\n');
    return `${content}`;
  }

  runItemPreset(item: ConstrainedEnumValueModel): Promise<string> {
    return this.runPreset('item', { item });
  }
}

export const PYTHON_DEFAULT_ENUM_PRESET: EnumPresetType<PythonOptions> = {
  self({ renderer }) {
    renderer.dependencyManager.addDependency('from enum import Enum');
    return renderer.defaultSelf();
  },
  item({ item }) {
    return `${item.key} = ${item.value}`;
  }
};
