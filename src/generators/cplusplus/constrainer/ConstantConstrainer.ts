import { ConstantConstraint } from '../../../helpers';
import { CplusplusOptions } from '../CplusplusGenerator';

export function defaultConstantConstraints(): ConstantConstraint<CplusplusOptions> {
  return () => {
    return undefined;
  };
}
