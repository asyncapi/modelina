import { CSharpRenderer } from '../CSharpRenderer';
import {
  ConstrainedDictionaryModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel
} from '../../../models';
import { pascalCase } from 'change-case';
import { CsharpRecordPreset } from '../CSharpPreset';
import { CSharpOptions } from '../CSharpGenerator';

/**
 * Renderer for CSharp's `struct` type
 *
 * @extends CSharpRenderer
 */
export class RecordRenderer extends CSharpRenderer<ConstrainedObjectModel> {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runAdditionalContentPreset()
    ];

    if (
      this.options?.collectionType === 'List' ||
      this.model.containsPropertyType(ConstrainedDictionaryModel)
    ) {
      this.dependencyManager.addDependency('using System.Collections.Generic;');
    }

    return `public partial record ${this.model.name}
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

export const CSHARP_DEFAULT_RECORD_PRESET: CsharpRecordPreset<CSharpOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  async property({ renderer, property }) {
    const getter = await renderer.runGetterPreset(property);
    const setter = await renderer.runSetterPreset(property);
    if (property.property.options.const) {
      return `public const ${property.property.type} ${pascalCase(
        property.propertyName
      )} = ${property.property.options.const.value};`;
    }
    return `public ${property.required ? 'required ' : ''}${
      property.property.type
    } ${pascalCase(property.propertyName)} { ${getter} ${setter} }`;
  },
  getter() {
    return 'get;';
  },
  setter() {
    return 'init;';
  },
  additionalContent() {
    return '';
  }
};
