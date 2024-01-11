import { defaultConstantConstraints } from '../../../../src/generators/python/constrainer/ConstantConstrainer';

const mockConstantContext = {
  constrainedMetaModel: {} as any
};

describe('defaultConstantConstraints', () => {
  it('should return a function that returns undefined', () => {
    const constantConstraintsFunction = defaultConstantConstraints();
    const result = constantConstraintsFunction(mockConstantContext);
    expect(result).toBeUndefined();
  });

  it('should return a ConstantConstraint type', () => {
    const constantConstraintsFunction = defaultConstantConstraints();
    const result = constantConstraintsFunction;
    expect(typeof result).toBe('function');
  });
});
