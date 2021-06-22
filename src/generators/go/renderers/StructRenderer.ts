import { GoRenderer } from '../GoRenderer';
import { StructPreset } from '../GoPreset';
import { FormatHelpers } from '../../../helpers/FormatHelpers';
import { pascalCaseTransformMerge } from "pascal-case";

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
    return `// ${formattedName} represents a ${formattedName} model.
type ${formattedName} struct {
${this.indent(this.renderBlock(content, 2))}
}`;
  }
}

export const GO_DEFAULT_STRUCT_PRESET: StructPreset<StructRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  ctor({ renderer, model }) {
    return 'thisShoulBeAConstructor';
  },
  field({ fieldName, field, renderer }) {
    return FormatHelpers.toPascalCase(fieldName, { transform: pascalCaseTransformMerge }) + ' ' + renderer.renderType(field)
  },
  getter({ fieldName }) {
    return 'getterFunc';
  },
  setter({ fieldName }) {
    return 'setterFunc';
  },
};
