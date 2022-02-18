import { TypeScriptRenderer } from '../TypeScriptRenderer';
import { ConstrainedObjectModel, InterfacePreset } from '../../../models';

/**
 * Renderer for TypeScript's `interface` type
 * 
 * @extends TypeScriptRenderer
 */
export class InterfaceRenderer extends TypeScriptRenderer<ConstrainedObjectModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runAdditionalContentPreset()
    ];

    return `interface ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }
}

export const TS_DEFAULT_INTERFACE_PRESET: InterfacePreset<InterfaceRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ renderer, property }) {
    return renderer.renderProperty(property);
  }
};
