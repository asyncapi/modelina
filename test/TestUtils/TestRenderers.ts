import { AbstractRenderer, CommonInputModel, CommonModel, RenderOutput } from '../../src';
import { JavaRenderer } from '../../src/generators/java/JavaRenderer';
import {testOptions, TestGenerator} from './TestGenerator';

export class TestRenderer extends AbstractRenderer {
  constructor(presets = []) {
    super(testOptions, new TestGenerator(), presets, new CommonModel(), new CommonInputModel());
  }
  render(): Promise<RenderOutput> {
    return Promise.resolve(RenderOutput.toRenderOutput({result: '', renderedName: ''}));
  }
}

export class MockJavaRenderer extends JavaRenderer {

}
