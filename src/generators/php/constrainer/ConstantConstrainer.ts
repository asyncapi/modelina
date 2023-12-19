import { PhpConstantConstraint } from '../PhpGenerator';

export function defaultConstantConstraints(): PhpConstantConstraint {
  return () => {
    return undefined;
  };
}
