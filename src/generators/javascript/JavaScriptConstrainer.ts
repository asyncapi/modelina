import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { Constraints } from '../../helpers';
import { JavaScriptTypeMapping } from './JavaScriptGenerator';
import { defaultConstantConstraints } from './constrainer/ConstantConstrainer';

export const JavaScriptDefaultTypeMapping: JavaScriptTypeMapping = {
  Object(): string {
    return '';
  },
  Reference(): string {
    return '';
  },
  Any(): string {
    return '';
  },
  Float(): string {
    return '';
  },
  Integer(): string {
    return '';
  },
  String(): string {
    return '';
  },
  Boolean(): string {
    return '';
  },
  Tuple(): string {
    return '';
  },
  Array(): string {
    return '';
  },
  Enum(): string {
    return '';
  },
  Union(): string {
    return '';
  },
  Dictionary(): string {
    return '';
  }
};

export const JavaScriptDefaultConstraints: Constraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints(),
  constant: defaultConstantConstraints()
};
