import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultEnumKeyConstraints, defaultEnumValueConstraints } from './constrainer/EnumConstrainer';
import { Constraints, TypeMapping } from '../../helpers';
import { JavaScriptOptions } from './JavaScriptGenerator';

export const JavaScriptDefaultTypeMapping: TypeMapping<JavaScriptOptions> = {
  Object (): string {
    return ''; 
  },
  Reference (): string {
    return ''; 
  },
  Any (): string {
    return ''; 
  },
  Float (): string {
    return ''; 
  },
  Integer (): string {
    return ''; 
  },
  String (): string {
    return ''; 
  },
  Boolean (): string {
    return ''; 
  },
  Tuple (): string {
    return ''; 
  },
  Array (): string {
    return ''; 
  },
  Enum (): string {
    return ''; 
  },
  Union (): string {
    return ''; 
  },
  Dictionary (): string {
    return '';
  }
};

export const JavaScriptDefaultConstraints: Constraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};
