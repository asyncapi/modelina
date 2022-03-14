import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
import { TypeHelpers, ModelKind, CommonNamingConventionImplementation, CommonNamingConvention } from '../../helpers';
import { Logger } from '../../utils';
import { JSONRenderer } from './JSONRenderer';

export interface JSONOptions extends CommonGeneratorOptions {
  namingConvention?: CommonNamingConvention,
  schemaType? : 'draft-04' | 'draft-06' | 'draft-07';
}

export class JSONGenerator extends AbstractGenerator<JSONOptions, any> {
  static defaultOptions:JSONOptions = {
    ...defaultGeneratorOptions,
    namingConvention: CommonNamingConventionImplementation,
    schemaType: 'draft-07'
  }

  constructor(
    options: JSONOptions = JSONGenerator.defaultOptions,
  ) {
    super('JSON', JSONGenerator.defaultOptions, options);
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   * 
   * For Java you need to specify which package the model is placed under.
   * 
   * @param model 
   * @param inputModel 
   * @param options used to render the full output
   */
  renderCompleteModel(model: CommonModel, inputModel: CommonInputModel, options: JSONOptions): Promise<RenderOutput> {
    console.log(options);
    return this.render(model,inputModel);
  }

  /**
   * Render a scattered model, where the source code and library and model dependencies are separated.
   * 
   * @param model 
   * @param inputModel 
   */
  public render(model: CommonModel, inputModel: CommonInputModel, options?: JSONOptions): Promise<RenderOutput> {
    const kind = TypeHelpers.extractKind(model);

    if (kind === ModelKind.ENUM || kind === ModelKind.ARRAY || kind === ModelKind.UNION) {
      return this.renderArray(model, inputModel);
    }

    if (kind === ModelKind.OBJECT) {
      return this.renderObject(model, inputModel);
    }

    Logger.warn(`JS generator, cannot generate model for '${model.$id} since type: ${kind}'`);
    return Promise.resolve(RenderOutput.toRenderOutput({result: '', renderedName: '', dependencies: []}));
  }

  renderObject(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const renderer = new JSONRenderer(this.options, this, [], model, inputModel);
    const renderedType = renderer.renderType(model);
    const renderedName = renderer.nameType(model.$id, model);
    const renderProperties = renderer.renderAllProperties(model);
    const result = JSON.stringify({
      $id: renderedName,
      type: renderedType,
      ...renderProperties
    }, null, 4);
    return Promise.resolve(
      RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies})
    );
  }

  renderArray(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const renderer = new JSONRenderer(this.options, this, [], model, inputModel);
    const renderedContents = renderer.renderArrayItems(model);
    const renderedName = renderer.nameType(model.$id, model);
    const result = JSON.stringify({
      $id: renderedName,
      type: 'array',
      ...renderedContents 
    }, null , 4);
    return Promise.resolve(
      RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies})
    );
  }
}
