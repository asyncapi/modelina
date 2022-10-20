import { FormatHelpers } from '../../../helpers';
import { ConstrainedMetaModel, ConstrainedUnionModel } from '../../../models';
import { JavaOptions } from '../JavaGenerator';
import { UnionPresetType } from '../JavaPreset';
import { JavaRenderer } from '../JavaRenderer';

/**
 * Renderer for Java's `Union` type
 * 
 * @extends UnionRenderer
 */
export class UnionRenderer extends JavaRenderer<ConstrainedUnionModel> {
  public async defaultSelf(): Promise<string> {
    const doc = this.renderComments(`${this.model.name} represents a union of types: ${this.model.union.map(m => m.type).join(', ')}`);

    const content = [
      await this.renderProperties(),
      this.renderEnum(),
      await this.renderAccessors(),
    ];

    return `${doc}
public class ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}
`;
  }

  async renderProperties(): Promise<string> {
    return this.renderBlock([await this.runPropertyPreset(this.model)]);
  }

  runPropertyPreset(property: ConstrainedUnionModel): Promise<string> {
    return this.runPreset('property', { property });
  }

  renderEnum(): string {
    const content: string[] = [];

    const unionTypes = this.model.union.map((unionModel) => {
      return FormatHelpers.toConstantCase(unionModel.type);
    }).join(', ');

    const enumName = FormatHelpers.toPascalCase(`${this.model.name}Case`);

    content.push(`private enum ${enumName} {
${this.indent(this.renderBlock([unionTypes]))}
}`);

    return this.renderBlock(content);
  }

  async renderAccessors(): Promise<string> {
    const content: string[] = [];

    for (const item of Object.values(this.model.union)) {
      const getter = await this.runGetterPreset(item);
      const setter = await this.runSetterPreset(item);
      const has = await this.runHasPreset(item);
      content.push(this.renderBlock([getter, setter, has]));
    }

    return this.renderBlock(content, 2);
  }

  runGetterPreset(item: ConstrainedMetaModel): Promise<string> {
    return this.runPreset('getter', { item });
  }

  runSetterPreset(item: ConstrainedMetaModel): Promise<string> {
    return this.runPreset('setter', { item });
  }

  runHasPreset(item: ConstrainedMetaModel): Promise<string> {
    return this.runPreset('has', { item });
  }
}

export const JAVA_DEFAULT_UNION_PRESET: UnionPresetType<JavaOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ model }) {
    return `private ${model.type} ${FormatHelpers.toCamelCase(model.name)};`;
  },
  getter({ item, model }) {
    const modelPascalCase = FormatHelpers.toPascalCase(model.name);
    const modelCamelCase = FormatHelpers.toCamelCase(model.name);
    const itemPascalCase = FormatHelpers.toPascalCase(item.name);
    const getterName = `get${modelPascalCase}${itemPascalCase}`;
    return `public ${item.type} ${getterName}() {
  return ${modelCamelCase} instanceof ${itemPascalCase} ? (${itemPascalCase}) ${modelCamelCase} : new ${itemPascalCase}();
}`;
  },
  setter({ item, model }) {
    const modelPascalCase = FormatHelpers.toPascalCase(model.name);
    const modelCamelCase = FormatHelpers.toCamelCase(model.name);
    const itemPascalCase = FormatHelpers.toPascalCase(item.name);
    const enumCamelCase = FormatHelpers.toCamelCase(`${model.name}Case`);
    const enumPascalCase = FormatHelpers.toPascalCase(`${model.name}Case`);
    const setterName = `set${modelPascalCase}${itemPascalCase}`;
    return `public void ${setterName}(${itemPascalCase} ${modelCamelCase}) {
  ${enumCamelCase} = ${enumPascalCase}.${FormatHelpers.toConstantCase(item.type)};
  this.${modelCamelCase} = ${modelCamelCase};
}`;
  },
  has({ item, model }) {
    const modelPascalCase = FormatHelpers.toPascalCase(model.name);
    const itemPascalCase = FormatHelpers.toPascalCase(item.name);
    const enumCamelCase = FormatHelpers.toCamelCase(`${model.name}Case`);
    const enumPascalCase = FormatHelpers.toPascalCase(`${model.name}Case`);
    const hasName = `has${modelPascalCase}${itemPascalCase}`;
    return `public boolean ${hasName}() {
  return ${enumCamelCase} == ${enumPascalCase}.${FormatHelpers.toConstantCase(item.type)};
}`;
  },
};
