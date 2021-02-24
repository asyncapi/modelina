import { TypeScriptRenderer } from '../TypeScriptRenderer';

import { InterfacePreset } from '../../../models';

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

    return `interface ${this.model.$id} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }
}

export const TS_DEFAULT_INTERFACE_PRESET: InterfacePreset<InterfaceRenderer> = {
  async self({ renderer }) {
    return `export ${await renderer.defaultSelf()}`;
  },
  property({ renderer, propertyName, property, parentModel }) {
    return renderer.renderProperty(propertyName, property, parentModel);
  },
  additionalProperties({renderer, additionalProperties}) {
    return `additionalProperties: Record<string, ${renderer.renderType(additionalProperties)}>;`;
  },
};
