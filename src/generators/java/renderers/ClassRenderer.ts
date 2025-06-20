import { JavaRenderer } from '../JavaRenderer';
import {
  ConstrainedArrayModel,
  ConstrainedDictionaryModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel,
  ConstrainedUnionModel
} from '../../../models';
import { FormatHelpers } from '../../../helpers';
import { JavaOptions } from '../JavaGenerator';
import { ClassPresetType } from '../JavaPreset';
import { unionIncludesBuiltInTypes } from '../JavaConstrainer';
import { isEnum } from '../../csharp/Constants';

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

    if (
      this.model.containsPropertyType(ConstrainedArrayModel) &&
      this.options?.collectionType === 'List'
    ) {
      this.addCollectionDependencies();
    }

    const useOptional =
      this.options?.useOptionalForNullableProperties &&
      this.doesContainOptionalProperties();
    if (useOptional) {
      this.dependencyManager.addDependency('import java.util.Optional;');
      this.dependencyManager.addDependency(
        'import static java.util.Optional.ofNullable;'
      );
    }

    if (this.model.containsPropertyType(ConstrainedDictionaryModel)) {
      this.dependencyManager.addDependency('import java.util.Map;');
    }

    const abstractType = this.model.options.isExtended ? 'interface' : 'class';

    const parentUnions = this.getParentUnions();
    const extend = this.model.options.extend?.filter(
      (extend) => extend.options.isExtended
    );
    const parents = [...(parentUnions ?? []), ...(extend ?? [])];

    if (parents.length) {
      for (const i of parents) {
        this.dependencyManager.addModelDependency(i);
      }

      const inheritanceKeyword = this.model.options.isExtended
        ? 'extends'
        : 'implements';

      return `public ${abstractType} ${
        this.model.name
      } ${inheritanceKeyword} ${parents.map((i) => i.name).join(', ')} {
${this.indent(this.renderBlock(content, 2))}
}`;
    }

    return `public ${abstractType} ${this.model.name} {
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

  private doesContainOptionalProperties(): boolean {
    const properties = Object.values(this.model.properties);
    return properties.some((prop) => !prop.required);
  }

  private addCollectionDependencies() {
    const properties = Object.values(this.model.properties);

    let needsList = false;
    let needsSet = false;

    for (const prop of properties) {
      const propertyModel = prop.property;
      if (propertyModel instanceof ConstrainedArrayModel) {
        const isUnique = propertyModel.originalInput?.uniqueItems === true;
        if (isUnique) {
          needsSet = true;
        } else {
          needsList = true;
        }
      }
    }

    if (needsList) {
      this.dependencyManager.addDependency('import java.util.List;');
    }

    if (needsSet) {
      this.dependencyManager.addDependency('import java.util.Set;');
    }
  }
}

const getOverride = (
  model: ConstrainedObjectModel,
  property: ConstrainedObjectPropertyModel
) => {
  const isOverride = model.options.extend?.find((extend) => {
    if (
      !extend.options.isExtended ||
      property.property instanceof ConstrainedDictionaryModel
    ) {
      return false;
    }

    if (
      extend instanceof ConstrainedObjectModel &&
      extend.properties[property.propertyName]
    ) {
      return true;
    }

    if (
      extend instanceof ConstrainedReferenceModel &&
      extend.ref instanceof ConstrainedObjectModel &&
      extend.ref.properties[property.propertyName]
    ) {
      return true;
    }
  });

  return isOverride ? '@Override\n' : '';
};

export const isDiscriminatorOrDictionary = (
  model: ConstrainedObjectModel,
  property: ConstrainedObjectPropertyModel
): boolean =>
  model.options.discriminator?.discriminator ===
    property.unconstrainedPropertyName ||
  property.property instanceof ConstrainedDictionaryModel;

export const isDiscriminatorInTree = (
  model: ConstrainedObjectModel,
  property: ConstrainedObjectPropertyModel
): boolean =>
  (model.options?.extend?.some(
    (ext) =>
      ext?.options?.discriminator?.discriminator ===
      property.unconstrainedPropertyName
  ) ||
    model.options?.parents?.some(
      (parent) =>
        parent?.options?.discriminator?.discriminator ===
        property.unconstrainedPropertyName
    )) ??
  false;

const isEnumImplementedByConstValue = (
  model: ConstrainedObjectModel,
  property: ConstrainedObjectPropertyModel
): boolean => {
  if (!isEnum(property)) {
    return false;
  }

  if (!model.options.implementedBy) {
    return false;
  }

  // if the implementedBy property exist in the model options, check if the property exists in the implementedBy model and check if the property is set with a const value
  return model.options.implementedBy.some((implementedBy) => {
    return (
      implementedBy instanceof ConstrainedObjectModel &&
      implementedBy.properties[property.propertyName] &&
      implementedBy.properties[property.propertyName].property.options.const
        ?.value
    );
  });
};

const isEnumOrEnumInExtended = (
  model: ConstrainedObjectModel,
  property: ConstrainedObjectPropertyModel
): boolean => {
  if (!isEnum(property)) {
    return false;
  }

  if (!model.options.extend) {
    return false;
  }

  return model.options.extend.some((extend) => {
    return (
      extend instanceof ConstrainedReferenceModel &&
      extend.ref instanceof ConstrainedObjectModel &&
      extend.ref.properties[property.propertyName] &&
      isEnum(extend.ref.properties[property.propertyName])
    );
  });
};

export const JAVA_DEFAULT_CLASS_PRESET: ClassPresetType<JavaOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ property, model, options }) {
    if (model.options.isExtended) {
      return '';
    }

    if (property.property.options.const?.value) {
      return `private final ${property.property.type} ${property.propertyName} = ${property.property.options.const.value};`;
    }

    if (
      options.useModelNameAsConstForDiscriminatorProperty &&
      property.unconstrainedPropertyName ===
        model.options.discriminator?.discriminator &&
      property.property.type === 'String'
    ) {
      return `private final ${property.property.type} ${property.propertyName} = "${model.name}";`;
    }

    return `private ${property.property.type} ${property.propertyName};`;
  },
  getter({ property, model, options }) {
    const getterName = `get${FormatHelpers.toPascalCase(
      property.propertyName
    )}`;

    const useOptional =
      options.useOptionalForNullableProperties && !property.required;

    const returnType = useOptional
      ? `Optional<${property.property.type}>`
      : property.property.type;

    const returnValue = useOptional
      ? `ofNullable(this.${property.propertyName})`
      : `this.${property.propertyName}`;

    if (model.options.isExtended) {
      if (isDiscriminatorOrDictionary(model, property)) {
        return '';
      }

      return `${returnType} ${getterName}();`;
    }

    return `${getOverride(model, property)}public ${returnType} ${getterName}() { return ${returnValue}; }`;
  },
  setter({ property, model }) {
    if (property.property.options.const?.value) {
      return '';
    }

    const setterName = FormatHelpers.toPascalCase(property.propertyName);

    if (model.options.isExtended) {
      // don't render setters for discriminator, dictionary properties, or enums that are set with a const value
      if (
        isDiscriminatorOrDictionary(model, property) ||
        isEnumImplementedByConstValue(model, property)
      ) {
        return '';
      }

      return `void set${setterName}(${property.property.type} ${property.propertyName});`;
    }

    if (isDiscriminatorInTree(model, property)) {
      return '';
    }

    // don't render override for enums that are set with a const value
    const override = !isEnumOrEnumInExtended(model, property)
      ? getOverride(model, property)
      : '';

    return `${override}public void set${setterName}(${property.property.type} ${property.propertyName}) { this.${property.propertyName} = ${property.propertyName}; }`;
  }
};
