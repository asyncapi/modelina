import { ConstantConstraint } from '../../../helpers';
import { JavaScriptConstantConstraint } from '../JavaScriptGenerator';

export function defaultConstantConstraints(): JavaScriptConstantConstraint {
  return () => {
    return undefined;
  };
}
