import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { defaultConstantConstraints } from './constrainer/ConstantConstrainer';
import { GoTypeMapping } from './GoGenerator';
import { ConstrainedMetaModel, ConstrainedObjectPropertyModel } from 'models';

export const GoDefaultTypeMapping: GoTypeMapping = {
  Object({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Reference({ constrainedModel }): string {
    return `${constrainedModel.name}`;
  },
  Any(): string {
    return 'interface{}';
  },
  Float({ constrainedModel, partOfProperty }): string {
    return getType({
      constrainedModel,
      partOfProperty,
      typeWhenNullableOrOptional: '*float64',
      type: 'float64'
    });
  },
  Integer({ constrainedModel, partOfProperty }): string {
    return getType({
      constrainedModel,
      partOfProperty,
      typeWhenNullableOrOptional: '*int',
      type: 'int'
    });
  },
  String({ constrainedModel, partOfProperty }): string {
    return getType({
      constrainedModel,
      partOfProperty,
      typeWhenNullableOrOptional: '*string',
      type: 'string'
    });
  },
  Boolean({ constrainedModel, partOfProperty }): string {
    return getType({
      constrainedModel,
      partOfProperty,
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
  Enum({ constrainedModel }): string {
    return constrainedModel.name;
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
  typeWhenNullableOrOptional,
  type
}: {
  constrainedModel: ConstrainedMetaModel;
  partOfProperty: ConstrainedObjectPropertyModel | undefined;
  typeWhenNullableOrOptional: string;
  type: string;
}) {
  const required = partOfProperty ? partOfProperty.required : false;
  if (constrainedModel.options.isNullable && !required) {
    return typeWhenNullableOrOptional;
  }
  return type;
}

export const GoDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints(),
  constant: defaultConstantConstraints()
};
