import { GoRenderer } from '../GoRenderer';
import { EnumPreset, CommonModel } from '../../../models';

/**
 * Renderer for Go's `enum` type
 * 
 * @extends GoRenderer
 */
export class EnumRenderer extends GoRenderer {
  public defaultSelf(): string {
    const formattedName = this.nameType(this.model.$id);
    const type = this.enumType(this.model);
    const doc = formattedName && this.renderCommentForEnumType(formattedName, type);

    return `${doc}
type ${formattedName} ${type}`;
  }

  enumType(model: CommonModel): string {
    if (this.model.type === undefined || Array.isArray(this.model.type)) {
      return 'interface{}';
    }

    return this.toGoType(this.model.type, model);
  }

  renderCommentForEnumType(name: string, type: string): string {
    const globalType = type === 'interface{}' ? 'mixed types' : type;
    return this.renderComments(`${name} represents an enum of ${globalType}.`);
  }
}

export const GO_DEFAULT_ENUM_PRESET: EnumPreset<EnumRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
};
