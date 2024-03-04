import { PythonConstantConstraint } from '../PythonGenerator';

export function defaultConstantConstraints(): PythonConstantConstraint {
  return () => {
    return undefined;
  };
}
