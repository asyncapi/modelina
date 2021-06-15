import { ToRenderOutputArg, RenderOutput } from '../../src/models'; 

describe('RenderOutput', () => {
  test('should return an RenderOutput', () => {
    const ioutput: ToRenderOutputArg = {
      result: 'result',
      dependencies: ['test']
    };
    const output = RenderOutput.toRenderOutput(ioutput);
    expect(output.result).toEqual(ioutput.result);
    expect(output.dependencies).toEqual(ioutput.dependencies);
  });
  test('should default to values', () => {
    const ioutput: ToRenderOutputArg = {
      result: 'result'
    };
    const output = RenderOutput.toRenderOutput(ioutput);
    expect(output.result).toEqual(ioutput.result);
    expect(output.dependencies).toEqual([]);
  });
});
