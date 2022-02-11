import { JavaScriptGenerator } from '../../../../../src/generators';
import { renderValueFromModel } from '../../../../../src/generators/javascript/presets/utils/ExampleFunction';
import { JavaScriptRenderer } from '../../../../../src/generators/javascript/JavaScriptRenderer';
import { CommonInputModel, CommonModel } from '../../../../../src/models';
class MockJavaScriptRenderer extends JavaScriptRenderer {
}
const renderer = new MockJavaScriptRenderer(JavaScriptGenerator.defaultOptions, new JavaScriptGenerator(), [], new CommonModel(), new CommonInputModel());
describe('Marshalling preset', () => {
  describe('.renderValueFromModel()', () => {
    test('should render refs correctly', () => {
      const input = CommonModel.toCommonModel({ $ref: 'SomeOtherModel' });
      const output = renderValueFromModel(input, renderer);
      expect(output).toEqual('SomeOtherModel.example()');
    });
    describe('types', () => {
      test('Should render strings correctly', () => {
        const input = CommonModel.toCommonModel({ type: 'string' });
        const output = renderValueFromModel(input, renderer);
        expect(output).toEqual('"string"');
      });
      test('Should render numbers correctly', () => {
        const input = CommonModel.toCommonModel({ type: 'number' });
        const output = renderValueFromModel(input, renderer);
        expect(output).toEqual('0');
      });
      test('Should render booleans correctly', () => {
        const input = CommonModel.toCommonModel({ type: 'boolean' });
        const output = renderValueFromModel(input, renderer);
        expect(output).toEqual('true');
      });
      test('Should use first value if there is more then one', () => {
        const input = CommonModel.toCommonModel({ type: ['boolean', 'string'] });
        const output = renderValueFromModel(input, renderer);
        expect(output).toEqual('true');
      });
      describe('array', () => {
        test('should not render anything if no items are defined', () => {
          const input = CommonModel.toCommonModel({ type: 'array' });
          const output = renderValueFromModel(input, renderer);
          expect(output).toEqual('[]');
        });
        test('should render multiple array values', () => {
          const input = CommonModel.toCommonModel({ type: 'array', items: [{ type: 'string' }, { type: 'number' }] });
          const output = renderValueFromModel(input, renderer);
          expect(output).toEqual('["string", 0]');
        });
        test('should render single array value', () => {
          const input = CommonModel.toCommonModel({ type: 'array', items: { type: 'string' } });
          const output = renderValueFromModel(input, renderer);
          expect(output).toEqual('["string"]');
        });
      });
      test('Should ignore if none are present', () => {
        const input = CommonModel.toCommonModel({ type: [] });
        const output = renderValueFromModel(input, renderer);
        expect(output).toBeUndefined();
      });
    });
  });
});    
