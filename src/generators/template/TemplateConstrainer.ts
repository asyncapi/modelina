import { TypeMapping } from '../../helpers';
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { TemplateDependencyManager } from './TemplateDependencyManager';
import { TemplateOptions } from './TemplateGenerator';

export const TemplateDefaultTypeMapping: TypeMapping<
  TemplateOptions,
  TemplateDependencyManager
> = {
  Object({ constrainedModel }): string {
    //Returning name here because all object models have been split out
    return constrainedModel.name;
  },
  Reference({ constrainedModel }): string {
    return constrainedModel.name;
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
  Enum({ constrainedModel }): string {
    //Returning name here because all enum models have been split out
    return constrainedModel.name;
  },
  Union(): string {
    return '';
  },
  Dictionary(): string {
    return '';
  }
};

export const TemplateDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};
