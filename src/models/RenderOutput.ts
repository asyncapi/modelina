export interface ToRenderOutputArg {
  result: string;
  dependencies: string[];
}

/**
 * Common representation for the rendered output.
 */
export class RenderOutput {
  constructor(
    public readonly result: string,
    public readonly dependencies: string[] = []
  ) {}

  static toRenderOutput(args: ToRenderOutputArg): RenderOutput;
  static toRenderOutput(args: Array<ToRenderOutputArg>): Array<RenderOutput>;
  static toRenderOutput(args: ToRenderOutputArg | Array<ToRenderOutputArg>): RenderOutput | Array<RenderOutput> {
    if (Array.isArray(args)) {
      return args.map(arg => new this(arg.result, arg.dependencies));
    }
    return new this(args.result, args.dependencies);
  }
}
