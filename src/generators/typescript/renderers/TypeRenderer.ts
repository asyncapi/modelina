import { TypeScriptRenderer } from '../TypeScriptRenderer';
import { TypePreset } from '../TypeScriptPreset';
import { TypeHelpers, ModelKind } from '../../../helpers';

/**
 * Renderer for TypeScript's `type` type
 * 
 * @extends TypeScriptRenderer
 */
export class TypeRenderer extends TypeScriptRenderer {
  async defaultSelf(): Promise<string> {
    const body = await this.renderTypeBody();
    const formattedName = this.nameType(this.model.$id);
    return `type ${formattedName} = ${body};`;
  }

  renderTypeBody(): Promise<string> {
    const kind = TypeHelpers.extractKind(this.model);
    if (kind === ModelKind.ENUM) {
      return Promise.resolve(this.renderEnum());
    }
    return Promise.resolve(this.renderType(this.model));
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
