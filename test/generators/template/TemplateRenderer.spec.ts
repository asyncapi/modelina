import { TemplateGenerator } from '../../../src/generators';
import { TemplateRenderer } from '../../../src/generators/template/TemplateRenderer';
import { CommonModel, ConstrainedObjectModel, ConstrainedEnumModel, ConstrainedStringModel, ConstrainedFloatModel, ConstrainedDictionaryModel, ConstrainedAnyModel, ConstrainedObjectPropertyModel, ConstrainedUnionModel, InputMetaModel, ConstrainedTupleModel, ConstrainedTupleValueModel, ConstrainedEnumValueModel, ConstrainedIntegerModel, ConstrainedBooleanModel, ConstrainedArrayModel } from '../../../src/models';
import { MockTemplateRenderer } from '../../TestUtils/TestRenderers';

describe('TemplateRenderer', () => {
  let renderer: TemplateRenderer<any>;
  beforeEach(() => {
    renderer = new MockTemplateRenderer(TemplateGenerator.defaultOptions, new TemplateGenerator(), [], new ConstrainedObjectModel('', undefined, '', {}), new InputMetaModel());
  });

  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual('// someComment');
    });
  });

  describe('renderMacro()', () => {
    const i32Model = new ConstrainedIntegerModel('test', undefined, '');
    const i64Model = new ConstrainedIntegerModel('test', { format: 'int64' }, '');
    const boolModel = new ConstrainedBooleanModel('test', undefined, '');
    const stringModel = new ConstrainedStringModel('test', undefined, 'String');
    const f64Model = new ConstrainedFloatModel('test', undefined, '');
    const f32Model = new ConstrainedFloatModel('test', { format: 'float32' }, '');
    const dictModel = new ConstrainedDictionaryModel('test', undefined, '', f32Model, f64Model);
    const anyModel = new ConstrainedAnyModel('test', undefined, '');

    test('Should derive all traits', () => {
      const tupleModel = new ConstrainedTupleModel('test', undefined, '', [new ConstrainedTupleValueModel(0, boolModel), new ConstrainedTupleValueModel(1, boolModel)]);
      const arrayModel = new ConstrainedArrayModel('test', undefined, '', i32Model);
      const enumModel = new ConstrainedEnumModel('test', undefined, '', [new ConstrainedEnumValueModel('one', i32Model,), new ConstrainedEnumValueModel('two', i32Model)]);
      const unionModel = new ConstrainedUnionModel('test', undefined, '', [
        i32Model,
        i64Model,
        boolModel,
        tupleModel,
        arrayModel,
        enumModel
      ]);
      const objectModel = new ConstrainedObjectModel('test', undefined, '', {
        i32Model: new ConstrainedObjectPropertyModel('test', 'test', true, i32Model),
        i64Model: new ConstrainedObjectPropertyModel('test', 'test', true, i64Model),
        boolProp: new ConstrainedObjectPropertyModel('test', 'test', true, boolModel),
        tupleModel: new ConstrainedObjectPropertyModel('test', 'test', true, tupleModel),
        unionModel: new ConstrainedObjectPropertyModel('test', 'test', true, unionModel),
        enumModel: new ConstrainedObjectPropertyModel('test', 'test', true, enumModel),

      });

      expect(renderer.renderMacro(arrayModel)).toEqual('#[derive(Clone, Copy, Debug, Deserialize, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]');
      expect(renderer.renderMacro(enumModel)).toEqual('#[derive(Clone, Copy, Debug, Deserialize, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]');
      expect(renderer.renderMacro(objectModel)).toEqual('#[derive(Clone, Copy, Debug, Deserialize, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]');
    });

    test('Should not derive Copy trait', () => {
      // String does not implement Copy
      const tupleModel = new ConstrainedTupleModel('test', undefined, '', [new ConstrainedTupleValueModel(0, stringModel), new ConstrainedTupleValueModel(1, stringModel)]);
      const arrayModel = new ConstrainedArrayModel('test', undefined, '', stringModel);
      const enumModel = new ConstrainedEnumModel('test', undefined, '', [new ConstrainedEnumValueModel('one', stringModel,), new ConstrainedEnumValueModel('two', stringModel)]);
      const unionModel = new ConstrainedUnionModel('test', undefined, '', [
        stringModel,
        i32Model,
        i64Model,
        boolModel,
        tupleModel,
        arrayModel,
        enumModel
      ]);
      const objectModel = new ConstrainedObjectModel('test', undefined, '', {
        i32Model: new ConstrainedObjectPropertyModel('test', 'test', true, i32Model),
        i64Model: new ConstrainedObjectPropertyModel('test', 'test', true, i64Model),
        boolProp: new ConstrainedObjectPropertyModel('test', 'test', true, boolModel),
        tupleModel: new ConstrainedObjectPropertyModel('test', 'test', true, tupleModel),
        unionModel: new ConstrainedObjectPropertyModel('test', 'test', true, unionModel),
        enumModel: new ConstrainedObjectPropertyModel('test', 'test', true, enumModel),

      });

      expect(renderer.renderMacro(arrayModel)).toEqual('#[derive(Clone, Debug, Deserialize, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]');
      expect(renderer.renderMacro(enumModel)).toEqual('#[derive(Clone, Debug, Deserialize, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]');
      expect(renderer.renderMacro(objectModel)).toEqual('#[derive(Clone, Debug, Deserialize, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]');
    });
    test('Should not derive Hash, Eq, Ord, PartialEq traits', () => {
      const tupleModel = new ConstrainedTupleModel('test', undefined, '', [new ConstrainedTupleValueModel(0, f32Model), new ConstrainedTupleValueModel(1, f64Model)]);
      const arrayModel = new ConstrainedArrayModel('test', undefined, '', f64Model);
      const enumModel = new ConstrainedEnumModel('test', undefined, '', [new ConstrainedEnumValueModel('one', f64Model,), new ConstrainedEnumValueModel('two', f32Model)]);
      const unionModel = new ConstrainedUnionModel('test', undefined, '', [
        i32Model,
        i64Model,
        boolModel,
        tupleModel,
        arrayModel,
        enumModel
      ]);
      const objectModel = new ConstrainedObjectModel('test', undefined, '', {
        i32Model: new ConstrainedObjectPropertyModel('test', 'test', true, i32Model),
        i64Model: new ConstrainedObjectPropertyModel('test', 'test', true, i64Model),
        boolProp: new ConstrainedObjectPropertyModel('test', 'test', true, boolModel),
        tupleModel: new ConstrainedObjectPropertyModel('test', 'test', true, tupleModel),
        unionModel: new ConstrainedObjectPropertyModel('test', 'test', true, unionModel),
        enumModel: new ConstrainedObjectPropertyModel('test', 'test', true, enumModel),

      });

      expect(renderer.renderMacro(arrayModel)).toEqual('#[derive(Clone, Copy, Debug, Deserialize, PartialEq, Serialize)]');
      expect(renderer.renderMacro(enumModel)).toEqual('#[derive(Clone, Copy, Debug, Deserialize, PartialEq, Serialize)]');
      expect(renderer.renderMacro(objectModel)).toEqual('#[derive(Clone, Copy, Debug, Deserialize, PartialEq, Serialize)]');
    });
  });
});
