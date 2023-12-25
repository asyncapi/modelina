import { defaultConstantConstraints } from '../../../../src/generators/cplusplus/constrainer/ConstantConstrainer';

describe('defaultConstantConstraints', () => {
  it('should return undefined', () => {
    const constraints = defaultConstantConstraints();
    const context = { constrainedMetaModel: {} as any };
    const result = constraints(context);
    expect(result).toBeUndefined();
  });
});