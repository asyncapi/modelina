import { TemplateGenerator } from '../../../src/generators/template';
import { TemplateRenderer } from '../../../src/generators/template/TemplateRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockTemplateRenderer } from '../../TestUtils/TestRenderers';

describe('TemplateRenderer', () => {
  let renderer: TemplateRenderer<any>;
  beforeEach(() => {
    renderer = new MockTemplateRenderer(
      TemplateGenerator.defaultOptions,
      new TemplateGenerator(),
      [],
      new ConstrainedObjectModel('', undefined, '', {}),
      new InputMetaModel()
    );
  });

  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual('// someComment');
    });
  });
});
