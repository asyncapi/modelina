import { DartConstantConstraint } from '../DartGenerator';

export function defaultConstantConstraints(): DartConstantConstraint {
  return () => {
    return undefined;
  };
}
