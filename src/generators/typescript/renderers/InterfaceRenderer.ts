import { TypeScriptRenderer } from '../TypeScriptRenderer';

import { InterfacePreset } from '../../../models';
import { FormatHelpers } from '../../../helpers';

/**
 * Renderer for TypeScript's `interface` type
 * 
 * @extends TypeScriptRenderer
 */
export class InterfaceRenderer extends TypeScriptRenderer {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runAdditionalContentPreset(),
    ];

    const formattedName = this.model.$id && FormatHelpers.toPascalCase(this.model.$id);
    return `interface ${formattedName} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }
}

export const TS_DEFAULT_INTERFACE_PRESET: InterfacePreset<InterfaceRenderer> = {
  async self({ renderer }) {
    return `export ${await renderer.defaultSelf()}`;
  },
  property({ renderer, propertyName, property, type }) {
    return renderer.renderProperty(propertyName, property, type);
  }
};
