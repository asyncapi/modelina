import {
  NO_NUMBER_START_CHAR,
  NO_EMPTY_VALUE,
  NO_DUPLICATE_PROPERTIES,
  FormatHelpers,
  NO_DUPLICATE_ENUM_KEYS
} from '../../src/helpers';
import {
  AnyModel,
  ConstrainedAnyModel,
  ConstrainedEnumModel,
  ConstrainedEnumValueModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  EnumModel,
  EnumValueModel,
  ObjectModel,
  ObjectPropertyModel
} from '../../src/models';

describe('Constraints', () => {
  describe('NO_NUMBER_START_CHAR', () => {
    test('should not prepend anything to empty values', () => {
      const renderedValue = NO_NUMBER_START_CHAR('');
      expect(renderedValue).toEqual('');
    });
    test('should prepend something to numbers', () => {
      const renderedValue = NO_NUMBER_START_CHAR('1');
      expect(renderedValue).toEqual('number_1');
    });
  });

  describe('NO_EMPTY_VALUE', () => {
    test('should not allow empty values', () => {
      const renderedValue = NO_EMPTY_VALUE('');
      expect(renderedValue).toEqual('empty');
    });
    test('should not do anything to nonempty values', () => {
      const renderedValue = NO_EMPTY_VALUE('1');
      expect(renderedValue).toEqual('1');
    });
  });
  describe('NO_DUPLICATE_PROPERTIES', () => {
    test('should not do anything with no duplicate properties', () => {
      const constrainedModel = new ConstrainedObjectModel(
        '',
        undefined,
        {},
        '',
        {}
      );
      const metaModel = new ObjectModel(
        '',
        undefined,
        {},
        {
          Test: new ObjectPropertyModel(
            'Test',
            false,
            new AnyModel('', undefined, {})
          )
        }
      );
      const renderedValue = NO_DUPLICATE_PROPERTIES(
        constrainedModel,
        metaModel,
        'Test',
        FormatHelpers.toPascalCase
      );
      expect(renderedValue).toEqual('Test');
    });
    test('should not use formatted property name which another raw property is', () => {
      const constrainedModel = new ConstrainedObjectModel(
        '',
        undefined,
        {},
        '',
        {}
      );
      const metaModel = new ObjectModel(
        '',
        undefined,
        {},
        {
          test: new ObjectPropertyModel(
            'test',
            false,
            new AnyModel('', undefined, {})
          ),
          Test: new ObjectPropertyModel(
            'Test',
            false,
            new AnyModel('', undefined, {})
          )
        }
      );
      const renderedValue = NO_DUPLICATE_PROPERTIES(
        constrainedModel,
        metaModel,
        'test',
        FormatHelpers.toPascalCase
      );
      expect(renderedValue).toEqual('reserved_test');
    });
    test('should should keep the raw property name if no clash', () => {
      const constrainedModel = new ConstrainedObjectModel(
        '',
        undefined,
        {},
        '',
        {}
      );
      const metaModel = new ObjectModel(
        '',
        undefined,
        {},
        {
          test: new ObjectPropertyModel(
            'test',
            false,
            new AnyModel('', undefined, {})
          ),
          Test: new ObjectPropertyModel(
            'Test',
            false,
            new AnyModel('', undefined, {})
          )
        }
      );
      const renderedValue = NO_DUPLICATE_PROPERTIES(
        constrainedModel,
        metaModel,
        'Test',
        FormatHelpers.toPascalCase
      );
      expect(renderedValue).toEqual('Test');
    });
    test('should be able to handle multiple reserved properties', () => {
      const constrainedModel = new ConstrainedObjectModel(
        '',
        undefined,
        {},
        '',
        {
          Test: new ConstrainedObjectPropertyModel(
            'Test',
            'Test',
            false,
            new ConstrainedAnyModel('', undefined, {}, '')
          ),
          ReservedTest: new ConstrainedObjectPropertyModel(
            'ReservedTest',
            'ReservedTest',
            false,
            new ConstrainedAnyModel('', undefined, {}, '')
          )
        }
      );
      const metaModel = new ObjectModel(
        '',
        undefined,
        {},
        {
          test: new ObjectPropertyModel(
            'test',
            false,
            new AnyModel('', undefined, {})
          ),
          Test: new ObjectPropertyModel(
            'Test',
            false,
            new AnyModel('', undefined, {})
          ),
          ReservedTest: new ObjectPropertyModel(
            'ReservedTest',
            false,
            new AnyModel('', undefined, {})
          )
        }
      );
      const renderedValue = NO_DUPLICATE_PROPERTIES(
        constrainedModel,
        metaModel,
        'test',
        FormatHelpers.toPascalCase
      );
      expect(renderedValue).toEqual('reserved_reserved_test');
    });
  });
  describe('NO_DUPLICATE_ENUM_KEYS', () => {
    test('should not do anything with no duplicate enum keys', () => {
      const constrainedModel = new ConstrainedEnumModel(
        '',
        undefined,
        {},
        '',
        []
      );
      const metaModel = new EnumModel('', undefined, {}, [
        new EnumValueModel('test', new AnyModel('', undefined, {}))
      ]);
      const renderedValue = NO_DUPLICATE_ENUM_KEYS(
        constrainedModel,
        metaModel,
        'test',
        FormatHelpers.toPascalCase
      );
      expect(renderedValue).toEqual('test');
    });
    test('should not use formatted enum key which another raw enum key is', () => {
      const constrainedModel = new ConstrainedEnumModel(
        '',
        undefined,
        {},
        '',
        []
      );
      const metaModel = new EnumModel('', undefined, {}, [
        new EnumValueModel('test', new AnyModel('', undefined, {})),
        new EnumValueModel('Test', new AnyModel('', undefined, {}))
      ]);
      const renderedValue = NO_DUPLICATE_ENUM_KEYS(
        constrainedModel,
        metaModel,
        'test',
        FormatHelpers.toPascalCase
      );
      expect(renderedValue).toEqual('reserved_test');
    });
    test('should should keep the raw enum key if no clash', () => {
      const constrainedModel = new ConstrainedEnumModel(
        '',
        undefined,
        {},
        '',
        []
      );
      const metaModel = new EnumModel('', undefined, {}, [
        new EnumValueModel('test', new AnyModel('', undefined, {})),
        new EnumValueModel('Test', new AnyModel('', undefined, {}))
      ]);
      const renderedValue = NO_DUPLICATE_ENUM_KEYS(
        constrainedModel,
        metaModel,
        'Test',
        FormatHelpers.toPascalCase
      );
      expect(renderedValue).toEqual('Test');
    });
    test('should be able to handle multiple reserved enum keys', () => {
      const constrainedModel = new ConstrainedEnumModel('', undefined, {}, '', [
        new ConstrainedEnumValueModel(
          'Test',
          new AnyModel('', undefined, {}),
          'Test'
        ),
        new ConstrainedEnumValueModel(
          'ReservedTest',
          new AnyModel('', undefined, {}),
          'ReservedTest'
        )
      ]);
      const metaModel = new EnumModel('', undefined, {}, [
        new EnumValueModel('test', new AnyModel('', undefined, {})),
        new EnumValueModel('Test', new AnyModel('', undefined, {})),
        new EnumValueModel('ReservedTest', new AnyModel('', undefined, {}))
      ]);
      const renderedValue = NO_DUPLICATE_ENUM_KEYS(
        constrainedModel,
        metaModel,
        'test',
        FormatHelpers.toPascalCase
      );
      expect(renderedValue).toEqual('reserved_reserved_test');
    });
  });
});
