import { ConstantConstraint } from '../../../helpers';
import { TemplateConstantConstraint } from '../TemplateGenerator';

export function defaultConstantConstraints(): TemplateConstantConstraint {
  return () => {
    return undefined;
  };
}
