import { ConstrainedEnumValueModel } from 'models';
import { TypeMapping } from '../../helpers';
import { defaultEnumKeyConstraints, defaultEnumValueConstraints } from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { CSharpOptions } from './CSharpGenerator';

const fromEnumValueToType = (enumValueModel: ConstrainedEnumValueModel): string => {
  switch (typeof enumValueModel.value) {
  case 'boolean':
    return 'bool';
  case 'number':
  case 'bigint':
    if(Number.isInteger(enumValueModel.value)) {
      return 'int';
    }
    return 'double';
  case 'string':
    return 'string';
  case 'object':
  default:
    return 'dynamic';
  }
};

export const CSharpDefaultTypeMapping: TypeMapping<CSharpOptions> = {
  Object ({constrainedModel}): string {
    return constrainedModel.name;
  },
  Reference ({constrainedModel}): string {
    return constrainedModel.name;
  },
  Any (): string {
    return 'dynamic';
  },
  Float (): string {
    return 'double';
  },
  Integer (): string {
    return 'int';
  },
  String (): string {
    return 'string';
  },
  Boolean (): string {
    return 'bool';
  },
  Tuple ({constrainedModel}): string {
    const tupleTypes = constrainedModel.tuple.map((constrainedType) => {
      return constrainedType.value.type;
    });
    return `(${tupleTypes.join(', ')})`;
  },
  Array ({constrainedModel, options}): string {
    if (options.collectionType && options.collectionType === 'List') {
      return `IEnumerable<${constrainedModel.valueModel.type}>`;
    }
    return `${constrainedModel.valueModel.type}[]`;
  },
  Enum ({constrainedModel}): string {
    const typesForValues: Set<string> = new Set();

    for (const value of constrainedModel.values) {
      const typeForValue = fromEnumValueToType(value);
      typesForValues.add(typeForValue);
    }
    // If there exist more then 1 unique type, then default to dynamic
    if(typesForValues.size > 1) {
      return 'dynamic';
    }
    const [typeForValues] = typesForValues;
    return typeForValues;
  },
  Union (): string {
    //Because CSharp have no notion of unions (and no custom implementation), we have to render it as any value.
    return 'dynamic';
  },
  Dictionary ({constrainedModel}): string {
    return `Dictionary<${constrainedModel.key.type}, ${constrainedModel.value.type}>`;
  }
};

export const CSharpDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};
