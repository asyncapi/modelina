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
  defaultSelf(): string {
    return `type ${this.model.name} = ${this.model.type};`;
  }
}

export const TS_DEFAULT_TYPE_PRESET: TypePresetType<TypeScriptOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  }
};
