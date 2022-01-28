import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
import { IndentationTypes } from '../../helpers';
import { TypeHelpers, ModelKind, CommonNamingConvention, CommonNamingConventionImplementation } from '../../helpers';
import { PythonPreset, PYTHON_DEFAULT_PRESET } from './PythonPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { Logger } from '../../';
  
export interface PythonOptions extends CommonGeneratorOptions<PythonPreset> {
    namingConvention?: CommonNamingConvention
  }
  
export interface PythonRenderCompleteModelOptions {
    packageName?: string
  }
  /**
   * Generator for Python
   */
  
export class PythonGenerator extends AbstractGenerator<PythonOptions, PythonRenderCompleteModelOptions> {
    static defaultOptions: PythonOptions = {
      indentation: {
        type: IndentationTypes.TABS,
        size: 1,
      },
      defaultPreset: PYTHON_DEFAULT_PRESET,
      namingConvention: CommonNamingConventionImplementation
    };
  
    constructor(
      options: PythonOptions = PythonGenerator.defaultOptions,
    ) {
      super('Python', PythonGenerator.defaultOptions, options);
    }
    
    /**
     * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
     *
     * @param model
     * @param inputModel
     * @param options
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async renderCompleteModel(model: CommonModel, inputModel: CommonInputModel, options: PythonRenderCompleteModelOptions): Promise<RenderOutput> {
      const outputModel = await this.render(model, inputModel);
      let modelDependencies = model.getNearestDependencies();
      //Ensure model dependencies have their rendered name
      modelDependencies = modelDependencies.map((dependencyModelName) => {
        return this.options.namingConvention?.type ? this.options.namingConvention.type(dependencyModelName, { inputModel, model: inputModel.models[String(dependencyModelName)] }) : dependencyModelName;
      });
      //Filter out any dependencies that is recursive to it'self
      modelDependencies = modelDependencies.filter((dependencyModelName) => {
        return dependencyModelName !== outputModel.renderedName;
      });
      //Create the correct dependency imports
      modelDependencies = modelDependencies.map((formattedDependencyModelName) => {
        return `from './${formattedDependencyModelName}' import ${formattedDependencyModelName}`;
      });
      const outputContent = `${[...modelDependencies, ...outputModel.dependencies].join('\n')}
${outputModel.result}`;
      return RenderOutput.toRenderOutput({ result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies });
    }
  
    render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
      const kind = TypeHelpers.extractKind(model);
      if (kind === ModelKind.OBJECT) {
        return this.renderClass(model, inputModel);
      }
      Logger.warn(`Python generator, cannot generate model for '${model.$id}'`);
      return Promise.resolve(RenderOutput.toRenderOutput({result: '', renderedName: '', dependencies: []}));
    }
  
    async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
      const presets = this.getPresets('class'); 
      const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
      const result = await renderer.runSelfPreset();
      const renderedName = renderer.nameType(model.$id, model);
      return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
    }
}
  
