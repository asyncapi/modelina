import { RustConstantConstraint } from '../RustGenerator';

export function defaultConstantConstraints(): RustConstantConstraint {
  return () => {
    return undefined;
  };
}
