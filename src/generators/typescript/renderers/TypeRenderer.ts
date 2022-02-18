import { TypeScriptRenderer } from '../TypeScriptRenderer';
import { TypePreset } from '../TypeScriptPreset';
import { TypeHelpers, ModelKind } from '../../../helpers';
import { ConstrainedMetaModel } from 'models';

/**
 * Renderer for TypeScript's `type` type
 * 
 * @extends TypeScriptRenderer
 */
export class TypeRenderer extends TypeScriptRenderer<ConstrainedMetaModel> {
  async defaultSelf(): Promise<string> {
    return `type ${this.model.name} = ${this.model.type};`;
  }
}

export const TS_DEFAULT_TYPE_PRESET: TypePreset<TypeRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
};
