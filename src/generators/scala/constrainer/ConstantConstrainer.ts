import { ScalaConstantConstraint } from '../ScalaGenerator';

export function defaultConstantConstraints(): ScalaConstantConstraint {
  return () => {
    return undefined;
  };
}
