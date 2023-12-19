import { RustGenerator } from '../../../../src';
import { RustDefaultConstraints } from '../../../../src/generators/rust/RustConstrainer';
import {
  defaultModelNameConstraints,
  ModelNameConstraints
} from '../../../../src/generators/rust/constrainer/ModelNameConstrainer';
describe('ModelNameConstrainer', () => {
  test('should never render special chars', () => {
    const constrainedKey = RustDefaultConstraints.modelName({
      modelName: '%',
      options: RustGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('Percent');
  });
  test('should never render number as start char', () => {
    const constrainedKey = RustDefaultConstraints.modelName({
      modelName: '1',
      options: RustGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('Number1');
  });
  test('should never contain empty name', () => {
    const constrainedKey = RustDefaultConstraints.modelName({
      modelName: '',
      options: RustGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('Empty');
  });
  test('should use constant naming format', () => {
    const constrainedKey = RustDefaultConstraints.modelName({
      modelName: 'some weird_value!"#2',
      options: RustGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('SomeWeirdValueExclamationQuotationHash2');
  });
  test('Reserved keywords should not take effect when naming formatter changes its format', () => {
    const constrainedKey = RustDefaultConstraints.modelName({
      modelName: 'return',
      options: RustGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('Return');
  });
  describe('custom constraints', () => {
    test('should make sure reserved keywords cannot be rendered', () => {
      const customNamingFormat: Partial<ModelNameConstraints> = {
        NAMING_FORMATTER: (value) => value
      };
      const constrainFunction = defaultModelNameConstraints(customNamingFormat);
      const constrainedKey = constrainFunction({
        modelName: 'return',
        options: RustGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('reserved_return');
    });
  });
});
