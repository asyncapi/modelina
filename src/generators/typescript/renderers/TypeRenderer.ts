import { TypeScriptRenderer } from '../TypeScriptRenderer';
import { TypePresetType } from '../TypeScriptPreset';
import { ConstrainedMetaModel } from '../../../models';
import { TypeScriptOptions } from '../TypeScriptGenerator';

/**
 * Renderer for TypeScript's `type` type
 *
 * @extends TypeScriptRenderer
 */
export class TypeRenderer extends TypeScriptRenderer<ConstrainedMetaModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.runAdditionalContentPreset()
    ];

    return `type ${this.model.name} = ${this.model.type};

${this.renderBlock(content, 2)}`;
  }
}

export const TS_DEFAULT_TYPE_PRESET: TypePresetType<TypeScriptOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  }
};
