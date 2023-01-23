import { TypeScriptOptions } from '../TypeScriptGenerator';
import { TypeScriptObjectRenderer } from '../TypeScriptObjectRenderer';
import { InterfacePresetType } from '../TypeScriptPreset';

/**
 * Renderer for TypeScript's `interface` type
 *
 * @extends TypeScriptRenderer
 */
export class InterfaceRenderer extends TypeScriptObjectRenderer {
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

export const TS_DEFAULT_INTERFACE_PRESET: InterfacePresetType<TypeScriptOptions> =
  {
    self({ renderer }) {
      return renderer.defaultSelf();
    },
    property({ renderer, property }) {
      return renderer.renderProperty(property);
    }
  };
