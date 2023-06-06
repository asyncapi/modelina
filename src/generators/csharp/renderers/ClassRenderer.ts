import { CSharpRenderer } from '../CSharpRenderer';
import {
  ConstrainedDictionaryModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel
} from '../../../models';
import { pascalCase } from 'change-case';
import { CsharpClassPreset } from '../CSharpPreset';
import { CSharpOptions } from '../CSharpGenerator';
import { isPrimitive, isEnum } from '../Constants';

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
      await this.runAdditionalContentPreset()
    ];

    if (
      this.options?.collectionType === 'List' ||
      this.model.containsPropertyType(ConstrainedDictionaryModel)
    ) {
      this.dependencyManager.addDependency('using System.Collections.Generic;');
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
    return this.runPreset('accessor', {
      property,
      options: this.options,
      renderer: this
    });
  }

  runPropertyPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('property', {
      property,
      options: this.options,
      renderer: this
    });
  }

  runGetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('getter', {
      property,
      options: this.options,
      renderer: this
    });
  }

  runSetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('setter', {
      property,
      options: this.options,
      renderer: this
    });
  }
}

export const CSHARP_DEFAULT_CLASS_PRESET: CsharpClassPreset<CSharpOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  async property({ renderer, property, options }) {
    let nullablePropertyEnding = '';
    if(options?.handleNullable
        && property.required
        && !isPrimitive(property)
        && !isEnum(property)) {
      nullablePropertyEnding = ' = null!';
    }

    if (options?.autoImplementedProperties) {
      const getter = await renderer.runGetterPreset(property);
      const setter = await renderer.runSetterPreset(property);

      const semiColon = nullablePropertyEnding !== '' ? ';' : '';
      return `public ${property.property.type} ${pascalCase(
        property.propertyName
      )} { ${getter} ${setter} }${nullablePropertyEnding}${semiColon}`;
    }
    return `private ${property.property.type} ${property.propertyName}${nullablePropertyEnding};`;
  },
  async accessor({ renderer, options, property }) {
    const formattedAccessorName = pascalCase(property.propertyName);
    if (options?.autoImplementedProperties) {
      return '';
    }

    return `public ${property.property.type} ${formattedAccessorName} 
{
  ${await renderer.runGetterPreset(property)}
  ${await renderer.runSetterPreset(property)}
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
