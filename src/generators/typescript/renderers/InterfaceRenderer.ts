import { TypeScriptRenderer } from '../TypeScriptRenderer';

import { InterfacePreset } from '../../../models';

/**
 * Renderer for TypeScript's `interface` type
 * 
 * @extends TypeScriptRenderer
 */
export class InterfaceRenderer extends TypeScriptRenderer {
  async defaultSelf(): Promise<string> {
    return `interface ${this.model.$id} {
${this.indent(await this.renderProperties())}
}`;
  }
}

export const TS_DEFAULT_INTERFACE_PRESET: InterfacePreset<InterfaceRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ renderer, propertyName, property, parentModel }) {
    return renderer.renderProperty(propertyName, property, parentModel);
  },
};
