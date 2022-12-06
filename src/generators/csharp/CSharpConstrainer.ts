import { ConstrainedObjectPropertyModel } from 'models';
import { TypeMapping } from '../../helpers';
import { defaultEnumKeyConstraints, defaultEnumValueConstraints } from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { CSharpOptions } from './CSharpGenerator';

function getFullTypeDefinition(typeName: string, partOfProperty: ConstrainedObjectPropertyModel | undefined) {
  return partOfProperty?.required ?? true
    ? typeName
    : `${typeName}?`;
};

export const CSharpDefaultTypeMapping: TypeMapping<CSharpOptions> = {

  Object({ constrainedModel, partOfProperty }): string {
    return getFullTypeDefinition(constrainedModel.name, partOfProperty);
  },
  Reference({ constrainedModel, partOfProperty }): string {
    return getFullTypeDefinition(constrainedModel.name, partOfProperty);
  },
  Any({ partOfProperty }): string {
    return getFullTypeDefinition('dynamic', partOfProperty);
  },
  Float({ partOfProperty }): string {
    return getFullTypeDefinition('double', partOfProperty);
  },
  Integer({ partOfProperty }): string {
    return getFullTypeDefinition('int', partOfProperty);
  },
  String({ partOfProperty }): string {
    return getFullTypeDefinition('string', partOfProperty);
  },
  Boolean({ partOfProperty }): string {
    return getFullTypeDefinition('bool', partOfProperty);
  },
  Tuple({ constrainedModel, partOfProperty }): string {
    const tupleTypes = constrainedModel.tuple.map((constrainedType) => {
      return constrainedType.value.type;
    });
    return getFullTypeDefinition(`(${tupleTypes.join(', ')})`, partOfProperty);
  },
  Array({ constrainedModel, options, partOfProperty }): string {
    const typeString = options.collectionType && options.collectionType === 'List'
      ? `IEnumerable<${constrainedModel.valueModel.type}>`
      : `${constrainedModel.valueModel.type}[]`;

    return getFullTypeDefinition(typeString, partOfProperty);
  },
  Enum({ constrainedModel, partOfProperty }): string {
    return getFullTypeDefinition(constrainedModel.name, partOfProperty);
  },
  Union({ partOfProperty }): string {
    //BecauserenderPrivateType( CSharp , partOfProperty) have no notion of unions (and no custom implementation), we have to render it as any value.

    return getFullTypeDefinition('dynamic', partOfProperty);
  },
  Dictionary({ constrainedModel, partOfProperty }): string {
    return getFullTypeDefinition(`Dictionary<${constrainedModel.key.type}, ${constrainedModel.value.type}>`, partOfProperty);
  }
};

export const CSharpDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};
