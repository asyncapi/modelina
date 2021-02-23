import { TypeScriptRenderer } from '../TypeScriptRenderer';

import { TypeHelpers, ModelKind } from '../../../helpers';
import { TypePreset } from '../TypeScriptPreset';

/**
 * Renderer for TypeScript's `type` type
 * 
 * @extends TypeScriptRenderer
 */
export class TypeRenderer extends TypeScriptRenderer {
  async defaultSelf(): Promise<string> {
    const body = await this.renderTypeBody();
    return `type ${this.model.$id} = ${body};`;
  }

  async renderTypeBody(): Promise<string> {
    const kind = TypeHelpers.extractKind(this.model);
    switch (kind) {
    case ModelKind.ENUM: {
      return this.renderEnum();
    }
    default: return this.renderType(this.model);
    }
  }
  
  renderEnum(): string {
    const enums = this.model.enum || [];
    return enums.map(t => typeof t === 'string' ? `"${t}"` : t).join(' | ');
  }
}

export const TS_DEFAULT_TYPE_PRESET: TypePreset<TypeRenderer> = {
  async self({ renderer }) {
    return `export ${await renderer.defaultSelf()}`;
  },
};
