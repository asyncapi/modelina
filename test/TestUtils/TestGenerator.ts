/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbstractGenerator, CommonInputModel, CommonModel, IndentationTypes, RenderOutput } from '../../src';

export const testOptions = {
  indentation: {
    type: IndentationTypes.SPACES,
    size: 2,
  }
};
export class TestGenerator extends AbstractGenerator {
  constructor() {
    super('TestGenerator', testOptions);
  }

  render(model: CommonModel, _inputModel: CommonInputModel): Promise<RenderOutput> {
    return Promise.resolve(RenderOutput.toRenderOutput({result: model.$id || 'rendered content', renderedName: 'TestName'}));
  }

  renderCompleteModel(_model: CommonModel, _inputModel: CommonInputModel, _options: any): Promise<RenderOutput> {
    return Promise.resolve(RenderOutput.toRenderOutput({result: 'rendered complete content', renderedName: 'TestName'}));
  }
}
