import { TypeMapping } from '../../helpers';
import { defaultEnumKeyConstraints, defaultEnumValueConstraints } from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { CSharpRenderer } from './CSharpRenderer';

export const CSharpDefaultTypeMapping: TypeMapping<CSharpRenderer> = {
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
    return 'float';
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
  Array ({constrainedModel, renderer}): string {
    if (renderer.options.collectionType && renderer.options.collectionType === 'List') {
      return `IEnumerable<${constrainedModel.valueModel.type}>`;
    }
    return `${constrainedModel.valueModel.type}[]`;
  },
  Enum ({constrainedModel}): string {
    return constrainedModel.name;
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
