import {
  ConstrainedDictionaryModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedUnionModel
} from '../../../models';
import { shouldRenderInterface } from '../renderers/ClassRenderer';
import { KotlinRenderer } from '../KotlinRenderer';
import { KotlinPreset } from '../KotlinPreset';

const JACKSON_ANNOTATION_PACKAGE = 'com.fasterxml.jackson.annotation';

/**
 * Preset which adds Jackson annotations for JSON serialization and deserialization.
 */
export const KOTLIN_JACKSON_PRESET: KotlinPreset = {
  class: {
    self({ renderer, model, content }) {
      const discriminator = discriminatorName(model);
      if (
        shouldRenderInterface(model) &&
        discriminator &&
        model.options.implementedBy?.length
      ) {
        return renderer.renderBlock([
          renderTypeInfo(renderer, discriminator),
          renderSubTypes(
            renderer,
            model.options.implementedBy,
            discriminator,
            discriminatorMapping(model)
          ),
          content
        ]);
      }

      const typeName = concreteDiscriminatorName(model);
      if (typeName) {
        addJacksonDependency(renderer, 'JsonTypeName');
        return renderer.renderBlock([
          renderer.renderAnnotation('JsonTypeName', `"${typeName}"`),
          content
        ]);
      }
      return content;
    },
    property({ renderer, model, property, content }) {
      const discriminator = inheritedDiscriminatorName(model);
      const usesGeneratedTypeId = Boolean(
        concreteDiscriminatorName(model) ||
          (shouldRenderInterface(model) && model.options.implementedBy?.length)
      );
      if (
        usesGeneratedTypeId &&
        property.unconstrainedPropertyName === discriminator
      ) {
        addJacksonDependency(renderer, 'JsonProperty');
        return renderer.renderBlock([
          renderer.renderAnnotation(
            'JsonProperty',
            {
              value: `"${property.unconstrainedPropertyName}"`,
              access: 'JsonProperty.Access.WRITE_ONLY'
            },
            'get:'
          ),
          content
        ]);
      }
      const isUnwrappedDictionary =
        property.property instanceof ConstrainedDictionaryModel &&
        property.property.serializationType === 'unwrap';
      if (isUnwrappedDictionary) {
        addJacksonDependency(renderer, 'JsonAnyGetter');
        if (shouldRenderInterface(model)) {
          return renderer.renderBlock([
            renderer.renderAnnotation('JsonAnyGetter', undefined, 'get:'),
            content
          ]);
        }
        addJacksonDependency(renderer, 'JsonAnySetter');
        const mutableMapType = property.property.type.replace(
          /^Map</,
          'MutableMap<'
        );
        const nullableMapType = `${property.property.type}?`;
        const renderedMapType = content.includes(nullableMapType)
          ? nullableMapType
          : property.property.type;
        const mutableContent = content
          .replace(renderedMapType, mutableMapType)
          .replace(' = null', ' = mutableMapOf()');
        return renderer.renderBlock([
          renderer.renderAnnotation('JsonAnyGetter', undefined, 'get:'),
          renderer.renderAnnotation('JsonAnySetter', undefined, 'field:'),
          mutableContent
        ]);
      }

      addJacksonDependency(renderer, 'JsonProperty');
      const annotations = [
        renderer.renderAnnotation(
          'JsonProperty',
          `"${property.unconstrainedPropertyName}"`,
          'get:'
        )
      ];
      if (!property.required) {
        addJacksonDependency(renderer, 'JsonInclude');
        annotations.push(
          renderer.renderAnnotation(
            'JsonInclude',
            'JsonInclude.Include.NON_NULL',
            'get:'
          )
        );
      }
      return renderer.renderBlock([...annotations, content]);
    }
  },
  enum: {
    item({ renderer, content, model, item }) {
      const defaultEnumValue = model.originalInput?.default;
      if (item.originalInput === defaultEnumValue) {
        addJacksonDependency(renderer, 'JsonEnumDefaultValue');
        return `@JsonEnumDefaultValue ${content}`;
      }
      return content;
    },
    value({ renderer, content }) {
      addJacksonDependency(renderer, 'JsonValue');
      return `@get:JsonValue ${content}`;
    },
    fromValue({ renderer, model }) {
      addJacksonDependency(renderer, 'JsonCreator');
      return `companion object {
    @JvmStatic
    @JsonCreator
    fun forValue(value: ${model.type}): ${model.name} {
        return values().firstOrNull { it.value == value }
            ?: throw IllegalArgumentException("Unexpected value '$value' for enum '${model.name}'")
    }
}`;
    }
  }
};

function addJacksonDependency<ModelType extends ConstrainedMetaModel>(
  renderer: KotlinRenderer<ModelType>,
  annotation: string
): void {
  renderer.dependencyManager.addDependency(
    `${JACKSON_ANNOTATION_PACKAGE}.${annotation}`
  );
}

function renderTypeInfo<ModelType extends ConstrainedMetaModel>(
  renderer: KotlinRenderer<ModelType>,
  discriminator: string
): string {
  addJacksonDependency(renderer, 'JsonTypeInfo');
  return renderer.renderAnnotation('JsonTypeInfo', {
    use: 'JsonTypeInfo.Id.NAME',
    include: 'JsonTypeInfo.As.PROPERTY',
    property: `"${discriminator}"`,
    visible: 'true'
  });
}

function renderSubTypes<ModelType extends ConstrainedMetaModel>(
  renderer: KotlinRenderer<ModelType>,
  subTypes: ConstrainedMetaModel[],
  discriminator: string,
  mapping: Map<string, string> = new Map()
): string {
  addJacksonDependency(renderer, 'JsonSubTypes');
  const renderedTypes = subTypes
    .map((subType) => {
      const model =
        subType instanceof ConstrainedReferenceModel ? subType.ref : subType;
      if (!(model instanceof ConstrainedObjectModel)) {
        return undefined;
      }
      const discriminatorValue =
        mapping.get(model.name) ||
        discriminatorConst(model, discriminator) ||
        model.name;
      return `JsonSubTypes.Type(value = ${model.name}::class, name = "${discriminatorValue}")`;
    })
    .filter(Boolean)
    .join(',\n');
  return renderer.renderAnnotation('JsonSubTypes', `\n${renderedTypes}\n`);
}

function discriminatorConst(
  model: ConstrainedObjectModel,
  discriminator: string
): string | undefined {
  const property = Object.values(model.properties).find(
    (candidate) => candidate.unconstrainedPropertyName === discriminator
  );
  const value = property?.property.options.const?.originalInput;
  return typeof value === 'string' ? value : undefined;
}

function inheritedDiscriminatorName(
  model: ConstrainedObjectModel
): string | undefined {
  const ownDiscriminator = discriminatorName(model);
  if (ownDiscriminator) {
    return ownDiscriminator;
  }
  for (const extended of model.options.extend || []) {
    const parent =
      extended instanceof ConstrainedReferenceModel ? extended.ref : extended;
    if (parent instanceof ConstrainedObjectModel) {
      const parentDiscriminator = discriminatorName(parent);
      if (parentDiscriminator) {
        return parentDiscriminator;
      }
    }
  }
  return undefined;
}

function concreteDiscriminatorName(
  model: ConstrainedObjectModel
): string | undefined {
  return extendedDiscriminatorName(model) || unionDiscriminatorName(model);
}

function extendedDiscriminatorName(
  model: ConstrainedObjectModel
): string | undefined {
  for (const extended of model.options.extend || []) {
    const parent =
      extended instanceof ConstrainedReferenceModel ? extended.ref : extended;
    if (!(parent instanceof ConstrainedObjectModel)) {
      continue;
    }
    const mapping = discriminatorMapping(parent);
    const discriminator = discriminatorName(parent);
    const typeName =
      mapping.get(model.name) ||
      (discriminator ? discriminatorConst(model, discriminator) : undefined);
    if (typeName) {
      return typeName;
    }
  }
  return undefined;
}

function unionDiscriminatorName(
  model: ConstrainedObjectModel
): string | undefined {
  for (const parent of model.options.parents || []) {
    if (
      parent instanceof ConstrainedUnionModel &&
      parent.options.discriminator
    ) {
      return (
        discriminatorConst(model, parent.options.discriminator.discriminator) ||
        model.name
      );
    }
  }
  return undefined;
}

function discriminatorName(model: ConstrainedObjectModel): string | undefined {
  const discriminator =
    model.options.discriminator?.discriminator ||
    model.originalInput?.discriminator;
  return typeof discriminator === 'string' ? discriminator : undefined;
}

function discriminatorMapping(
  model: ConstrainedObjectModel
): Map<string, string> {
  const mapping = model.originalInput?.['x-discriminator-mapping'];
  if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) {
    return new Map();
  }

  const result = new Map<string, string>();
  for (const [wireValue, schemaReference] of Object.entries(mapping)) {
    if (typeof schemaReference === 'string') {
      result.set(
        schemaReference.split('/').pop() || schemaReference,
        wireValue
      );
    }
  }
  return result;
}
