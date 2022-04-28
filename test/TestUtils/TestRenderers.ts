import { AbstractRenderer, CommonInputModel, CommonModel, RenderOutput } from '../../src';
import { GoRenderer } from '../../src/generators/go/GoRenderer';
import { CSharpRenderer } from '../../src/generators/csharp/CSharpRenderer';
import { JavaRenderer } from '../../src/generators/java/JavaRenderer';
import { JavaScriptRenderer } from '../../src/generators/javascript/JavaScriptRenderer';
import { TypeScriptRenderer } from '../../src/generators/typescript/TypeScriptRenderer';
import {testOptions, TestGenerator} from './TestGenerator';

export class TestRenderer extends AbstractRenderer {
  constructor(presets = []) {
    super(testOptions, new TestGenerator(), presets, new CommonModel(), new CommonInputModel());
  }
  render(): Promise<RenderOutput> {
    return Promise.resolve(RenderOutput.toRenderOutput({result: '', renderedName: ''}));
  }
}

export class MockJavaRenderer extends JavaRenderer {}
export class MockTypeScriptRenderer extends TypeScriptRenderer {}
export class MockGoRenderer extends GoRenderer {}
export class MockCSharpRenderer extends CSharpRenderer {}
export class MockJavaScriptRenderer extends JavaScriptRenderer {}
