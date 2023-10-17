/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AbstractGenerator,
  IndentationTypes,
  RenderOutput,
  ConstrainedMetaModel,
  MetaModel,
  ConstrainedAnyModel,
  Preset,
  AbstractGeneratorRenderCompleteModelArgs,
  AbstractGeneratorRenderArgs
} from '../../src';
import { AbstractDependencyManager } from '../../src/generators/AbstractDependencyManager';

export const testOptions = {
  indentation: {
    type: IndentationTypes.SPACES,
    size: 2
  }
};
export class TestGenerator extends AbstractGenerator<any, any> {
  constructor(options: any = testOptions) {
    super('TestGenerator', options);
  }

  public constrainToMetaModel(model: MetaModel): ConstrainedMetaModel {
    return new ConstrainedAnyModel(model.name, undefined, {}, '');
  }

  public splitMetaModel(model: MetaModel): MetaModel[] {
    return [model];
  }

  public render(args: AbstractGeneratorRenderArgs<any>): Promise<RenderOutput> {
    return Promise.resolve(
      RenderOutput.toRenderOutput({
        result: args.constrainedModel.name || 'rendered content',
        renderedName: 'TestName'
      })
    );
  }

  public renderCompleteModel(
    args: AbstractGeneratorRenderCompleteModelArgs<any, any>
  ): Promise<RenderOutput> {
    return Promise.resolve(
      RenderOutput.toRenderOutput({
        result: args.constrainedModel.name || 'rendered complete content',
        renderedName: 'TestName'
      })
    );
  }

  public testGetPresets(string: string): Array<[Preset, unknown]> {
    return this.getPresets(string);
  }

  public getDependencyManager(options: any): AbstractDependencyManager {
    return new AbstractDependencyManager();
  }
}
