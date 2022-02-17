import { GoRenderer } from '../GoRenderer';
import { FieldType, StructPreset } from '../GoPreset';
import { CommonModel } from 'models';

/**
 * Renderer for Go's `struct` type
 * 
 * @extends GoRenderer
 */
export class StructRenderer extends GoRenderer {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderFields(),
      await this.runAdditionalContentPreset()
    ];
    
    const formattedName = this.nameType(this.model.$id);
    const doc = this.renderComments(`${formattedName} represents a ${formattedName} model.`);
    
    return `${doc}
type ${formattedName} struct {
${this.indent(this.renderBlock(content, 2))}
}`;
  }
  runFieldTagPreset(fieldName: string, field: CommonModel, type: FieldType = FieldType.field): Promise<string> {
    return this.runPreset('fieldTag', { fieldName, field, type});
  }
}
export const GO_DEFAULT_STRUCT_PRESET: StructPreset<StructRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  async field({ fieldName, field, renderer, type }) {
    const formattedFieldName = renderer.nameField(fieldName, field);
    let fieldType = renderer.renderType(field);
    if (type === FieldType.additionalProperty || type === FieldType.patternProperties) {
      fieldType = `map[string]${fieldType}`; 
    }
    const fieldTags = await renderer.runFieldTagPreset(fieldName, field, type);
    let fieldTag = '';
    if (fieldTags !== '') {
      fieldTag = ` \`${fieldTags}\``;
    }

    return `${formattedFieldName} ${fieldType}${fieldTag}`;
  },
};
