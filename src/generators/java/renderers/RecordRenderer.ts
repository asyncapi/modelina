import { JavaRenderer } from '../JavaRenderer';
import {
  ConstrainedArrayModel,
  ConstrainedDictionaryModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedUnionModel
} from '../../../models';
import { JavaOptions } from '../JavaGenerator';
import { unionIncludesBuiltInTypes } from '../JavaConstrainer';
import { RecordPresetType } from '../JavaPreset';
import { JavaImportUtils } from '../JavaImportUtils';

/**
 * Renderer for Java's `record` type
 *
 * @extends JavaRenderer
 */
export class RecordRenderer extends JavaRenderer<ConstrainedObjectModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.runCtorPreset(),
      await this.runAdditionalContentPreset()
    ];

    if (
      this.model.containsPropertyType(ConstrainedArrayModel) &&
      this.options?.collectionType === 'List'
    ) {
      this.dependencyManager.addDependency('import java.util.List;');
    }
    if (this.model.containsPropertyType(ConstrainedDictionaryModel)) {
      this.dependencyManager.addDependency('import java.util.Map;');
    }

    JavaImportUtils.addCollectionDependencies(
      this.options,
      this.model.properties,
      this.dependencyManager
    );
    JavaImportUtils.addDependenciesForStringTypes(
      this.model.properties,
      this.dependencyManager
    );

    const parentUnions = this.getParentUnions();
    const parents = [...(parentUnions ?? [])];
    const recordProperties = await this.renderProperties();

    if (parents.length) {
      for (const i of parents) {
        this.dependencyManager.addModelDependency(i);
      }

      const inheritanceKeyworkd = 'implements';

      return `public record ${this.model.name}(${recordProperties}) ${inheritanceKeyworkd} ${parents.map((i) => i.name).join(', ')} {
${this.indent(this.renderBlock(content, 2))}
}`;
    }

    return `public record ${this.model.name}(${recordProperties}) {
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

    return content.join(', ');
  }

  runPropertyPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('property', { property });
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

export const JAVA_DEFAULT_RECORD_PRESET: RecordPresetType<JavaOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ property }) {
    return `${property.property.type} ${property.propertyName}`;
  }
};
