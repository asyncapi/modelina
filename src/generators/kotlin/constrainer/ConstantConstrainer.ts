import { KotlinConstantConstraint } from '../KotlinGenerator';

export function defaultConstantConstraints(): KotlinConstantConstraint {
  return () => {
    return undefined;
  };
}
