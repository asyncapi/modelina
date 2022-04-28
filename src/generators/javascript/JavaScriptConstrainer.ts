import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultEnumKeyConstraints, defaultEnumValueConstraints } from './constrainer/EnumConstrainer';
import { TypeMapping } from 'helpers';
import { JavaScriptRenderer } from './JavaScriptRenderer';

export const JavaScriptDefaultTypeMapping: TypeMapping<JavaScriptRenderer> = {
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

export const JavaScriptDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};
