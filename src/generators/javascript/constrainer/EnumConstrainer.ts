import { EnumKeyConstraint, EnumValueConstraint } from '../../../helpers';
/**
 * Enums for JS do not have any constraints because we never render anything specific for enums.
 **/
export function defaultEnumKeyConstraints(): EnumKeyConstraint {
  return ({ enumKey }) => {
    return enumKey;
  };
}

export function defaultEnumValueConstraints(): EnumValueConstraint {
  return ({ enumValue }) => {
    return enumValue;
  };
}
