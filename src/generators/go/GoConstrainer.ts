import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { defaultConstantConstraints } from './constrainer/ConstantConstrainer';
import { GoTypeMapping } from './GoGenerator';
import {
  ConstrainedMetaModel,
  ConstrainedObjectPropertyModel
} from '../../models';

export const GoDefaultTypeMapping: GoTypeMapping = {
  Object({ constrainedModel, partOfProperty, options }): string {
    return getOptionalNamedType(
      constrainedModel.name,
      partOfProperty,
      options
    );
  },
  Reference({ constrainedModel, partOfProperty, options }): string {
    return getOptionalNamedType(
      constrainedModel.name,
      partOfProperty,
      options
    );
  },
  Any(): string {
    return 'interface{}';
  },
  Float({ constrainedModel, partOfProperty, options }): string {
    return getType({
      constrainedModel,
      partOfProperty,
      options,
      typeWhenNullableOrOptional: '*float64',
      type: 'float64'
    });
  },
  Integer({ constrainedModel, partOfProperty, options }): string {
    return getType({
      constrainedModel,
      partOfProperty,
      options,
      typeWhenNullableOrOptional: '*int',
      type: 'int'
    });
  },
  String({
    constrainedModel,
    partOfProperty,
    options,
    dependencyManager
  }): string {
    const useTime =
      options.useTimeForDateTime && isDateTime(constrainedModel.originalInput);
    if (useTime) {
      dependencyManager.addDependency('time');
    }
    return getType({
      constrainedModel,
      partOfProperty,
      options,
      typeWhenNullableOrOptional: useTime ? '*time.Time' : '*string',
      type: useTime ? 'time.Time' : 'string'
    });
  },
  Boolean({ constrainedModel, partOfProperty, options }): string {
    return getType({
      constrainedModel,
      partOfProperty,
      options,
      typeWhenNullableOrOptional: '*bool',
      type: 'bool'
    });
  },
  Tuple(): string {
    //Because Go have no notion of tuples (and no custom implementation), we have to render it as a list of any value.
    return '[]interface{}';
  },
  Array({ constrainedModel }): string {
    return `[]${constrainedModel.valueModel.type}`;
  },
  Enum({ constrainedModel, partOfProperty, options }): string {
    return getOptionalNamedType(
      constrainedModel.name,
      partOfProperty,
      options
    );
  },
  Union({ constrainedModel }): string {
    //Because Go have no notion of unions (and no custom implementation), we have to render it as any value.
    return constrainedModel.name;
  },
  Dictionary({ constrainedModel }): string {
    return `map[${constrainedModel.key.type}]${constrainedModel.value.type}`;
  }
};

function getType({
  constrainedModel,
  partOfProperty,
  options,
  typeWhenNullableOrOptional,
  type
}: {
  constrainedModel: ConstrainedMetaModel;
  partOfProperty: ConstrainedObjectPropertyModel | undefined;
  options: { usePointersForOptionalFields?: boolean };
  typeWhenNullableOrOptional: string;
  type: string;
}) {
  const required = partOfProperty?.required ?? false;
  const optionalProperty = partOfProperty !== undefined && !required;
  if (
    (constrainedModel.options.isNullable && !required) ||
    (optionalProperty && options.usePointersForOptionalFields)
  ) {
    return typeWhenNullableOrOptional;
  }
  return type;
}

function getOptionalNamedType(
  type: string,
  partOfProperty: ConstrainedObjectPropertyModel | undefined,
  options: { usePointersForOptionalFields?: boolean }
): string {
  const optionalProperty =
    partOfProperty !== undefined && !partOfProperty.required;
  if (
    optionalProperty &&
    options.usePointersForOptionalFields &&
    !type.startsWith('*')
  ) {
    return `*${type}`;
  }
  return type;
}

function isDateTime(originalInput: unknown): boolean {
  if (typeof originalInput !== 'object' || originalInput === null) {
    return false;
  }
  return (originalInput as { format?: unknown }).format === 'date-time';
}

export const GoDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints(),
  constant: defaultConstantConstraints()
};
