import { CSharpRenderer } from '../CSharpRenderer';
import { ConstrainedObjectModel, ConstrainedObjectPropertyModel} from '../../../models';
import { pascalCase } from 'change-case';
import { CsharpClassPreset } from '../CSharpPreset';
import { CSharpOptions } from '../CSharpGenerator';

/**
 * Renderer for CSharp's `struct` type
 * 
 * @extends CSharpRenderer
 */
export class ClassRenderer extends CSharpRenderer<ConstrainedObjectModel> {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset(),
    ];

    if (this.options?.collectionType === 'List' ||
      this.model.additionalProperties !== undefined ||
      this.model.patternProperties !== undefined) {
      this.addDependency('using System.Collections.Generic;');
    }

    return `public class ${this.model.name}
{
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  async renderProperties(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const property of Object.values(properties)) {
      const rendererProperty = await this.runPropertyPreset(property);
      content.push(rendererProperty);
    }

    return this.renderBlock(content);
  }

  async renderAccessors(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const property of Object.values(properties)) {
      content.push(await this.runAccessorPreset(property));
    }

    return this.renderBlock(content, 2);
  }

  runCtorPreset(): Promise<string> {
    return this.runPreset('ctor');
  }

  runAccessorPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('accessor', { property });
  }

  runPropertyPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('property', { property });
  }

  runGetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('getter', { property });
  }

  runSetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('setter', { property });
  }
}

export const CSHARP_DEFAULT_CLASS_PRESET: CsharpClassPreset<CSharpOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  async property({ renderer, property, options }) {
    if (options.autoImplementedProperties) {
      const getter = await renderer.runGetterPreset(property, options);
      const setter = await renderer.runSetterPreset(property, options);
      return `public ${property.property.type} ${pascalCase(property.propertyName)} { ${getter} ${setter} }`;
    }
    return `private ${property.property.type} ${property.propertyName};`;
  },
  async accessor({ renderer, options, property }) {
    const formattedAccessorName = pascalCase(property.propertyName);
    if (options?.autoImplementedProperties) {
      return '';
    }

    return `public ${property.property.type} ${formattedAccessorName} 
{
  ${await renderer.runGetterPreset(property, options)}
  ${await renderer.runSetterPreset(property, options)}
}`;
  },
  getter({ options, property }) {
    if (options?.autoImplementedProperties) {
      return 'get;';
    }
    return `get { return ${property.propertyName}; }`;
  },
  setter({ options, property }) {
    if (options?.autoImplementedProperties) {
      return 'set;';
    }
    return `set { ${property.propertyName} = value; }`;
  }
};
