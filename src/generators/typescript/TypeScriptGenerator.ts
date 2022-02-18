import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { CommonModel, ConstrainedMetaModel, ConstrainedObjectModel, EnumModel, InputMetaModel, RenderOutput } from '../../models';
import { TypeHelpers, ModelKind, CommonNamingConvention, CommonNamingConventionImplementation } from '../../helpers';
import { TypeScriptPreset, TS_DEFAULT_PRESET } from './TypeScriptPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { InterfaceRenderer } from './renderers/InterfaceRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { TypeRenderer } from './renderers/TypeRenderer';

export interface TypeScriptOptions extends CommonGeneratorOptions<TypeScriptPreset> {
  renderTypes?: boolean;
  modelType?: 'class' | 'interface';
  enumType?: 'enum' | 'union';
  namingConvention?: CommonNamingConvention;
}
export interface TypeScriptRenderCompleteModelOptions {
  moduleSystem?: 'ESM' | 'CJS';
}

/**
 * Generator for TypeScript
 */
export class TypeScriptGenerator extends AbstractGenerator<TypeScriptOptions,TypeScriptRenderCompleteModelOptions> {
  static defaultOptions: TypeScriptOptions = {
    ...defaultGeneratorOptions,
    renderTypes: true,
    modelType: 'class',
    enumType: 'enum',
    defaultPreset: TS_DEFAULT_PRESET,
    namingConvention: CommonNamingConventionImplementation
  };

  constructor(
    options: TypeScriptOptions = TypeScriptGenerator.defaultOptions,
  ) {
    super('TypeScript', TypeScriptGenerator.defaultOptions, options);
  }
  
  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   *
   * @param model
   * @param inputModel
   * @param options
   */
  async renderCompleteModel(model: ConstrainedMetaModel, inputModel: InputMetaModel, options: TypeScriptRenderCompleteModelOptions): Promise<RenderOutput> {
    const outputModel = await this.render(model, inputModel);
    let modelDependencies = model.getNearestDependencies();
    //Ensure model dependencies have their rendered name
    modelDependencies = modelDependencies.map((dependencyModelName) => {
      return this.options.namingConvention?.type ? this.options.namingConvention.type(dependencyModelName, { inputModel, model: inputModel.models[String(dependencyModelName)] }) : dependencyModelName;
    });
    //Filter out any dependencies that is recursive to itself
    modelDependencies = modelDependencies.filter((dependencyModelName) => {
      return dependencyModelName !== outputModel.renderedName;
    });
    //Create the correct dependency imports
    modelDependencies = modelDependencies.map((formattedDependencyModelName) => {
      if (options.moduleSystem === 'CJS') {
        return `const ${formattedDependencyModelName} = require('./${formattedDependencyModelName}');`;
      }
      return `import ${formattedDependencyModelName} from './${formattedDependencyModelName}';`;
    });

    //Ensure we expose the model correctly, based on the module system
    let modelCode = `${outputModel.result}
export default ${outputModel.renderedName};
`;
    if (options.moduleSystem === 'CJS') {
      modelCode = `${outputModel.result}
module.exports = ${outputModel.renderedName};`;
    }

    const outputContent = `${[...modelDependencies, ...outputModel.dependencies].join('\n')}

${modelCode}`;
    return RenderOutput.toRenderOutput({ result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies });
  }

  render(model: ConstrainedMetaModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    if (model instanceof ConstrainedObjectModel){
      if (this.options.modelType === 'interface') {
        return this.renderInterface(model, inputModel);
      }
      return this.renderClass(model, inputModel);
    } else if (model instanceof EnumModel) {
      if (this.options.enumType === 'union') {
        return this.renderType(model, inputModel);
      }
      return this.renderEnum(model, inputModel);
    } else {
      return this.renderType(model, inputModel);
    }
  }

  async renderClass(model: ConstrainedObjectModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('class'); 
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: renderer.dependencies});
  }

  async renderInterface(model: ConstrainedObjectModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('interface'); 
    const renderer = new InterfaceRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: renderer.dependencies});
  }

  async renderEnum(model: ConstrainedMetaModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum'); 
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: renderer.dependencies});
  }

  async renderType(model: ConstrainedMetaModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('type'); 
    const renderer = new TypeRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: renderer.dependencies});
  }
}
