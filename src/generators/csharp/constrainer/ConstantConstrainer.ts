import { CSharpConstantConstraint } from '../CSharpGenerator';

export function defaultConstantConstraints(): CSharpConstantConstraint {
  return () => {
    return undefined;
  };
}
