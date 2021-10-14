export interface ToRenderOutputArg {
  result: string;
  renderedName: string;
  dependencies?: string[];
}

/**
 * Common representation for the rendered output.
 */
export class RenderOutput {
  constructor(
    public readonly result: string,
    public readonly renderedName: string,
    public readonly dependencies: string[] = []
  ) {}

  static toRenderOutput(args: ToRenderOutputArg): RenderOutput {
    return new this(args.result, args.renderedName, args.dependencies);
  }
}
