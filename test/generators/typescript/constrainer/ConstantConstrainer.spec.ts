import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  TypeScriptGenerator
} from '../../../../src';
import { defaultConstantConstraints } from '../../../../src/generators/typescript/constrainer/ConstantConstrainer';

describe('ConstantConstrainer', () => {
  test('should not render anything if const options are not set', () => {
    const constrainedConstant = defaultConstantConstraints()({
      constrainedMetaModel: new ConstrainedStringModel(
        'testStringModel',
        undefined,
        {},
        'String'
      ),
      options: TypeScriptGenerator.defaultOptions
    });
    expect(constrainedConstant).toBeUndefined();
  });

  describe('ConstrainedReferenceModel with ConstrainedEnumModel', () => {
    test('should render enum', () => {
      const constrainedConstant = defaultConstantConstraints()({
        constrainedMetaModel: new ConstrainedReferenceModel(
          'testRefModel',
          undefined,
          {
            const: {
              originalInput: 'testValue'
            }
          },
          'TestRefType',
          new ConstrainedEnumModel(
            'testEnumModel',
            undefined,
            {},
            'TestEnumType',
            [new ConstrainedEnumValueModel('testKey', 'testValue', 'testValue')]
          )
        ),
        options: TypeScriptGenerator.defaultOptions
      });
      expect(constrainedConstant).toEqual('TestRefType.testKey');
    });
  });

  describe('ConstrainedEnumModel', () => {
    test('should render enum', () => {
      const constrainedConstant = defaultConstantConstraints()({
        constrainedMetaModel: new ConstrainedEnumModel(
          'testEnumModel',
          undefined,
          { const: { originalInput: 'testValue' } },
          'TestEnumType',
          [new ConstrainedEnumValueModel('testKey', 'testValue', 'testValue')]
        ),
        options: TypeScriptGenerator.defaultOptions
      });
      expect(constrainedConstant).toEqual('TestEnumType.testKey');
    });
  });

  describe('ConstrainedStringModel', () => {
    test('should render enum', () => {
      const constrainedConstant = defaultConstantConstraints()({
        constrainedMetaModel: new ConstrainedStringModel(
          'testStringModel',
          undefined,
          { const: { originalInput: 'testValue' } },
          'String'
        ),
        options: TypeScriptGenerator.defaultOptions
      });
      expect(constrainedConstant).toEqual("'testValue'");
    });
  });
});
