import { ConstrainedUnionModel } from '../../../models';
import { JavaOptions } from '../JavaGenerator';
import { UnionPresetType } from '../JavaPreset';
import { JavaRenderer } from '../JavaRenderer';

/**
 * Renderer for Java's `Union` type
 * 
 * @extends UnionRenderer
 */
export class UnionRenderer extends JavaRenderer<ConstrainedUnionModel> {
  public defaultSelf(): string {
    const doc = this.renderComments(`${this.model.name} represents a union of types: ${this.model.union.map(m => m.type).join(', ')}`);

    const content = [
      this.renderEnum(),
    ];

    return `${doc}
public class ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}
`;
  }

  renderEnum(): string {
    const content: string[] = [];

    const unionTypes = this.model.union.map((unionModel) => {
      return unionModel.type;
    }).join(', ');

    content.push(`private enum ${this.model.name}Case {
  ${unionTypes}
}`);

    return this.renderBlock(content);
  }
}

export const JAVA_DEFAULT_UNION_PRESET: UnionPresetType<JavaOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
};
