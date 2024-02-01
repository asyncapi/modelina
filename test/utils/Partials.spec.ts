import { DeepPartial, mergePartialAndDefault } from '../../src/utils';

describe('mergePartialAndDefault', () => {
  test('should handle default objects', () => {
    interface TestType {
      nestedObject: {
        nested: string;
      };
      testProp: string;
    }
    const defaultOptions: TestType = {
      nestedObject: {
        nested: 'test'
      },
      testProp: 'test'
    };
    const partialOptions: DeepPartial<TestType> = {
      testProp: 'test2'
    };
    const realizedOptions = mergePartialAndDefault(
      defaultOptions,
      partialOptions
    ) as TestType;
    expect(realizedOptions.testProp).toEqual('test2');
    expect(realizedOptions.nestedObject.nested).toEqual('test');
  });
  test('should handle overwriting nested objects', () => {
    interface TestType {
      nestedObject: {
        nested: string;
      };
    }
    const defaultOptions: TestType = {
      nestedObject: {
        nested: 'test'
      }
    };
    const partialOptions: DeepPartial<TestType> = {
      nestedObject: {
        nested: 'test2'
      }
    };
    const realizedOptions = mergePartialAndDefault(
      defaultOptions,
      partialOptions
    ) as TestType;
    expect(realizedOptions.nestedObject.nested).toEqual('test2');
  });
  test('should not overwrite old realized options', () => {
    interface TestType {
      nestedObject: {
        nested: string;
      };
    }
    const defaultOptions: TestType = {
      nestedObject: {
        nested: 'test'
      }
    };
    const partialOptions: DeepPartial<TestType> = {
      nestedObject: {
        nested: 'test2'
      }
    };
    const partialOptions2: DeepPartial<TestType> = {
      nestedObject: {
        nested: 'test3'
      }
    };
    const realizedOptions = mergePartialAndDefault(
      defaultOptions,
      partialOptions
    ) as TestType;
    mergePartialAndDefault(defaultOptions, partialOptions2) as TestType;
    expect(realizedOptions.nestedObject.nested).toEqual('test2');
  });

  test('should keep class types for instances of non-regular objects', () => {
    class TestClass {
      test() {
        return true;
      }
    }
    interface TestType {
      nestedObject: TestClass;
      testProp: string;
    }
    const defaultOptions: TestType = {
      nestedObject: new TestClass(),
      testProp: 'test'
    };
    const partialOptions: DeepPartial<TestType> = {
      testProp: 'test2'
    };
    const realizedOptions = mergePartialAndDefault(
      defaultOptions,
      partialOptions
    ) as TestType;
    expect(realizedOptions.testProp).toEqual('test2');
    expect(realizedOptions.nestedObject instanceof TestClass).toEqual(true);
    expect(realizedOptions.nestedObject.test()).toEqual(true);
  });

  test('should not return default options instance', () => {
    interface TestType {
      array: string[];
    }
    const defaultOptions: TestType = {
      array: []
    };
    const partialOptions: DeepPartial<TestType> = {
      array: ['test']
    };
    const realizedOptions = mergePartialAndDefault(
      defaultOptions,
      partialOptions
    ) as TestType;
    expect(defaultOptions).toEqual({ array: [] });
    expect(realizedOptions).toEqual({ array: ['test'] });
  });
});
