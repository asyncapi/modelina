export interface ToRenderOutputArg {
  result: string;
  renderedName: string;
  dependencies?: string[];
  testResult?: string;
}

/**
 * Common representation for the rendered output.
 */
export class RenderOutput {
  constructor(
    public readonly result: string,
    public readonly renderedName: string,
    public readonly dependencies: string[] = [],
    public readonly testResult?: string
  ) {}

  static toRenderOutput(args: ToRenderOutputArg): RenderOutput {
    return new this(args.result, args.renderedName, args.dependencies, args.testResult);
  }
}
