import { GoRenderer } from '../../../src/generators/go/GoRenderer';
import { CommonInputModel, CommonModel } from '../../../src/models';
class MockGoRenderer extends GoRenderer {

}
describe('GoRenderer', () => {
    let renderer: MockGoRenderer;
    beforeEach(() => {
        renderer = new MockGoRenderer({}, [], new CommonModel(), new CommonInputModel());
    });

    describe('toGoType()', () => {
        test('Should render interface type', () => {
            expect(renderer.toGoType(undefined, new CommonModel())).toEqual('interface{}');
        });
        test('Should render int type', () => {
            expect(renderer.toGoType('integer', new CommonModel())).toEqual('int');
            expect(renderer.toGoType('number', new CommonModel())).toEqual('int');
        });
        test('Should render array type', () => {
            const model = new CommonModel();
            model.items = CommonModel.toCommonModel({ type: 'number' });
            expect(renderer.toGoType('array', model)).toEqual('[]int');
        });
        test('Should render tuple with one type as slice of that type', () => {
            const model = new CommonModel();
            model.items = [CommonModel.toCommonModel({ type: 'number' })];
            expect(renderer.toGoType('array', model)).toEqual('[]int');
        });
        test('Should render tuple with multiple types as slice of interface{}', () => {
            const model = new CommonModel();
            model.items = [CommonModel.toCommonModel({ type: 'number' }), CommonModel.toCommonModel({ type: 'string' })];
            expect(renderer.toGoType('array', model)).toEqual('[]interface{}');
        });
    });
    describe('renderType()', () => {
        test('Should render refs with pascal case (no _ prefix before numbers)', () => {
            const model = new CommonModel();
            model.$ref = '<anonymous-schema-1>';
            expect(renderer.renderType(model)).toEqual('AnonymousSchema1');
        });
        test('Should render union types with one type as slice of that type', () => {
            const model = CommonModel.toCommonModel({ type: ['number'] });
            expect(renderer.renderType(model)).toEqual('[]int');
        });
        test('Should render union types with multiple types as slice of interface', () => {
            const model = CommonModel.toCommonModel({ type: ['number', 'string'] });
            expect(renderer.renderType(model)).toEqual('[]interface{}');
        });
    });
});
