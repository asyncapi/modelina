import { GoRenderer } from '../GoRenderer';
import { StructPreset } from '../GoPreset';
import { FormatHelpers } from '../../../helpers/FormatHelpers';
import { pascalCaseTransformMerge } from 'pascal-case';

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

    const formattedName = this.model.$id && FormatHelpers.toPascalCase(this.model.$id, { transform: pascalCaseTransformMerge });
    const doc = this.renderComments(`${formattedName} represents a ${formattedName} model.`);
    
    return `${doc}
type ${formattedName} struct {
${this.indent(this.renderBlock(content, 2))}
}`;
  }
  
  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    return lines.map(line => `// ${line}`).join('\n');
  }
}

export const GO_DEFAULT_STRUCT_PRESET: StructPreset<StructRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  field({ fieldName, field, renderer }) {
    return `${FormatHelpers.toPascalCase(fieldName, { transform: pascalCaseTransformMerge }) } ${ renderer.renderType(field)}`;
  },
};
