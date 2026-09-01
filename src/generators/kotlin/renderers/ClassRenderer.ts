import { KotlinRenderer } from '../KotlinRenderer';
import {
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel,
  ConstrainedUnionModel
} from '../../../models';
import { KotlinOptions } from '../KotlinGenerator';
import { ClassPresetType } from '../KotlinPreset';
import { kotlinUnionIncludesBuiltInTypes } from '../KotlinConstrainer';
import { getSharedPolymorphicBase } from './UnionRenderer';

/** Renderer for Kotlin classes and interfaces. */
export class ClassRenderer extends KotlinRenderer<ConstrainedObjectModel> {
  async defaultSelf(): Promise<string> {
    const hasProperties = Object.keys(this.model.properties).length > 0;
    const parents = getParentModels(this.model);
    const inheritance = parents.length
      ? ` : ${parents.map((parent) => parent.name).join(', ')}`
      : '';

    if (shouldRenderInterface(this.model)) {
      if (!hasProperties) {
        return `interface ${this.model.name}${inheritance}`;
      }
      const properties = await this.renderProperties();
      return `interface ${this.model.name}${inheritance} {
${this.indent(properties)}
}`;
    }

    if (!hasProperties) {
      return `class ${this.model.name}${inheritance}`;
    }

    const content = [
      await this.renderProperties(),
      await this.runAdditionalContentPreset()
    ];
    return `data class ${this.model.name}(
${this.indent(this.renderBlock(content, 2))}
)${inheritance}`;
  }

  async renderProperties(): Promise<string> {
    const properties = Object.values(this.model.properties || {});
    if (this.options.requiredPropertiesFirst) {
      properties.sort(
        (first, second) => Number(second.required) - Number(first.required)
      );
    }
    const content: string[] = [];

    for (const property of properties) {
      const rendererProperty = await this.runPropertyPreset(property);
      content.push(rendererProperty);
    }

    return this.renderBlock(content);
  }

  runPropertyPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('property', { property });
  }
}

export function shouldRenderInterface(model: ConstrainedObjectModel): boolean {
  return Boolean(
    model.options.isExtended || model.options.implementedBy?.length
  );
}

function getParentModels(
  model: ConstrainedObjectModel
): ConstrainedMetaModel[] {
  const parents: ConstrainedMetaModel[] = [];

  for (const parent of model.options.parents || []) {
    if (
      parent instanceof ConstrainedUnionModel &&
      !kotlinUnionIncludesBuiltInTypes(parent)
    ) {
      parents.push(parent);
    }
  }

  const basesInheritedThroughUnions = new Set(
    parents
      .filter(
        (parent): parent is ConstrainedUnionModel =>
          parent instanceof ConstrainedUnionModel
      )
      .map(getSharedPolymorphicBase)
      .filter((base): base is ConstrainedObjectModel => base !== undefined)
      .map((base) => base.name)
  );

  for (const extended of model.options.extend || []) {
    const extendedModel =
      extended instanceof ConstrainedReferenceModel ? extended.ref : extended;
    if (
      extendedModel instanceof ConstrainedObjectModel &&
      shouldRenderInterface(extendedModel) &&
      !basesInheritedThroughUnions.has(extendedModel.name)
    ) {
      parents.push(extended);
    }
  }

  return parents.filter(
    (parent, index) =>
      parents.findIndex((candidate) => candidate.name === parent.name) === index
  );
}

function overridesParentProperty(
  model: ConstrainedObjectModel,
  property: ConstrainedObjectPropertyModel
): boolean {
  for (const parent of getParentModels(model)) {
    if (parent instanceof ConstrainedUnionModel) {
      if (
        parent.options.discriminator?.discriminator ===
        property.unconstrainedPropertyName
      ) {
        return true;
      }
      const sharedBase = getSharedPolymorphicBase(parent);
      if (
        sharedBase &&
        Object.values(sharedBase.properties).some(
          (parentProperty) =>
            parentProperty.unconstrainedPropertyName ===
            property.unconstrainedPropertyName
        )
      ) {
        return true;
      }
    }

    const parentModel =
      parent instanceof ConstrainedReferenceModel ? parent.ref : parent;
    if (
      parentModel instanceof ConstrainedObjectModel &&
      Object.values(parentModel.properties).some(
        (parentProperty) =>
          parentProperty.unconstrainedPropertyName ===
          property.unconstrainedPropertyName
      )
    ) {
      return true;
    }
  }
  return false;
}

export const KOTLIN_DEFAULT_CLASS_PRESET: ClassPresetType<KotlinOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ property, model }) {
    const optionalType = property.required ? '' : '?';
    if (shouldRenderInterface(model)) {
      return `val ${property.propertyName}: ${property.property.type}${optionalType}`;
    }

    const override = overridesParentProperty(model, property)
      ? 'override '
      : '';
    const defaultValue = property.required ? '' : ' = null';
    return `${override}val ${property.propertyName}: ${property.property.type}${optionalType}${defaultValue},`;
  }
};
