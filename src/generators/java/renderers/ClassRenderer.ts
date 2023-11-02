import { JavaRenderer } from '../JavaRenderer';
import {
  ConstrainedDictionaryModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedUnionModel
} from '../../../models';
import { FormatHelpers } from '../../../helpers';
import { JavaOptions } from '../JavaGenerator';
import { ClassPresetType } from '../JavaPreset';
import { unionIncludesBuiltInTypes } from '../JavaConstrainer';

/**
 * Renderer for Java's `class` type
 *
 * @extends JavaRenderer
 */
export class ClassRenderer extends JavaRenderer<ConstrainedObjectModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset()
    ];

    if (this.options?.collectionType === 'List') {
      this.dependencyManager.addDependency('import java.util.List;');
    }
    if (this.model.containsPropertyType(ConstrainedDictionaryModel)) {
      this.dependencyManager.addDependency('import java.util.Map;');
    }

    if (this.model.options.isExtended) {
      return `public interface ${this.model.name} {
        ${this.indent(this.renderBlock(content, 2))}
        }`;
    }

    const parentUnions = this.getParentUnions();
    const extend = this.model.options.extend;

    if (parentUnions || extend) {
      const implement = [...(parentUnions ?? []), ...(extend ?? [])];

      for (const i of implement) {
        this.dependencyManager.addModelDependency(i);
      }

      return `public class ${this.model.name} implements ${implement
        .map((i) => i.name)
        .join(', ')} {
${this.indent(this.renderBlock(content, 2))}
}`;
    }

    return `public class ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  runCtorPreset(): Promise<string> {
    return this.runPreset('ctor');
  }

  /**
   * Render all the properties for the class.
   */
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
    return this.runPreset('property', { property });
  }

  /**
   * Render all the accessors for the properties
   */
  async renderAccessors(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const property of Object.values(properties)) {
      const getter = await this.runGetterPreset(property);
      const setter = await this.runSetterPreset(property);
      content.push(this.renderBlock([getter, setter]));
    }

    return this.renderBlock(content, 2);
  }

  runGetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('getter', { property });
  }

  runSetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('setter', { property });
  }

  private getParentUnions(): ConstrainedUnionModel[] | undefined {
    const parentUnions: ConstrainedUnionModel[] = [];

    if (!this.model.options.parents) {
      return undefined;
    }

    for (const model of this.model.options.parents) {
      if (
        model instanceof ConstrainedUnionModel &&
        !unionIncludesBuiltInTypes(model)
      ) {
        parentUnions.push(model);
      }
    }

    if (!parentUnions.length) {
      return undefined;
    }

    return parentUnions;
  }
}

export const JAVA_DEFAULT_CLASS_PRESET: ClassPresetType<JavaOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ property }) {
    if (property.property.options.const?.value) {
      return `private final ${property.property.type} ${property.propertyName} = ${property.property.options.const.value};`;
    }

    return `private ${property.property.type} ${property.propertyName};`;
  },
  getter({ property }) {
    const getterName = `get${FormatHelpers.toPascalCase(
      property.propertyName
    )}`;
    return `@Override
public ${property.property.type} ${getterName}() { return this.${property.propertyName}; }`;
  },
  setter({ property }) {
    if (property.property.options.const?.value) {
      return '';
    }
    const setterName = FormatHelpers.toPascalCase(property.propertyName);
    return `@Override
public void set${setterName}(${property.property.type} ${property.propertyName}) { this.${property.propertyName} = ${property.propertyName}; }`;
  }
};
