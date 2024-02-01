import { GoConstantConstraint } from '../GoGenerator';

export function defaultConstantConstraints(): GoConstantConstraint {
  return () => {
    return undefined;
  };
}
