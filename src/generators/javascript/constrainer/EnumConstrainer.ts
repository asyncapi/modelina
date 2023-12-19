import { EnumKeyConstraint, EnumValueConstraint } from '../../../helpers';
import {
  JavaScriptEnumKeyConstraint,
  JavaScriptEnumValueConstraint
} from '../JavaScriptGenerator';
/**
 * Enums for JS do not have any constraints because we never render anything specific for enums.
 **/
export function defaultEnumKeyConstraints(): JavaScriptEnumKeyConstraint {
  return ({ enumKey }) => {
    return enumKey;
  };
}

export function defaultEnumValueConstraints(): JavaScriptEnumValueConstraint {
  return ({ enumValue }) => {
    return enumValue;
  };
}
