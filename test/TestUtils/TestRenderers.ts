import {
  AbstractRenderer,
  InputMetaModel,
  RenderOutput,
  ConstrainedAnyModel
} from '../../src';
import { GoRenderer } from '../../src/generators/go/GoRenderer';
import { CSharpRenderer } from '../../src/generators/csharp/CSharpRenderer';
import { JavaRenderer } from '../../src/generators/java/JavaRenderer';
import { JavaScriptRenderer } from '../../src/generators/javascript/JavaScriptRenderer';
import { TypeScriptRenderer } from '../../src/generators/typescript/TypeScriptRenderer';
import { testOptions, TestGenerator } from './TestGenerator';
import { DartRenderer } from '../../src/generators/dart/DartRenderer';
import { RustRenderer } from '../../src/generators/rust/RustRenderer';
import { PythonRenderer } from '../../src/generators/python/PythonRenderer';
import { KotlinRenderer } from '../../src/generators/kotlin/KotlinRenderer';
import { PhpRenderer } from '../../src/generators/php/PhpRenderer';
import { ScalaRenderer } from '../../src/generators/scala/ScalaRenderer';

export class TestRenderer extends AbstractRenderer {
  constructor(presets = []) {
    super(
      testOptions,
      new TestGenerator(),
      presets,
      new ConstrainedAnyModel('', undefined, {}, ''),
      new InputMetaModel()
    );
  }
  render(): Promise<RenderOutput> {
    return Promise.resolve(
      RenderOutput.toRenderOutput({ result: '', renderedName: '' })
    );
  }
}

export class MockJavaRenderer extends JavaRenderer<any> {}
export class MockTypeScriptRenderer extends TypeScriptRenderer<any> {}
export class MockGoRenderer extends GoRenderer<any> {}
export class MockCSharpRenderer extends CSharpRenderer<any> {}
export class MockJavaScriptRenderer extends JavaScriptRenderer<any> {}
export class MockDartRenderer extends DartRenderer<any> {}
export class MockRustRenderer extends RustRenderer<any> {}
export class MockPythonRenderer extends PythonRenderer<any> {}
export class MockKotlinRenderer extends KotlinRenderer<any> {}
export class MockPhpRenderer extends PhpRenderer<any> {}
export class MockScalaRenderer extends ScalaRenderer<any> {}
