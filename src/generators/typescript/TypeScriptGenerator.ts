import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { ConstrainedEnumModel, ConstrainedMetaModel, ConstrainedObjectModel, InputMetaModel, MetaModel, RenderOutput } from '../../models';
import { constrainMetaModel, Constraints, split, TypeMapping } from '../../helpers';
import { TypeScriptPreset, TS_DEFAULT_PRESET } from './TypeScriptPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { InterfaceRenderer } from './renderers/InterfaceRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { TypeRenderer } from './renderers/TypeRenderer';
import { TypeScriptDefaultConstraints, TypeScriptDefaultTypeMapping } from './TypeScriptConstrainer';

export interface TypeScriptOptions extends CommonGeneratorOptions<TypeScriptPreset> {
  renderTypes: boolean;
  modelType: 'class' | 'interface';
  enumType: 'enum' | 'union';
  typeMapping: TypeMapping<TypeScriptOptions>;
  constraints: Constraints;
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
    typeMapping: TypeScriptDefaultTypeMapping,
    constraints: TypeScriptDefaultConstraints
  };

  constructor(
    options: Partial<TypeScriptOptions> = TypeScriptGenerator.defaultOptions,
  ) {
    const realizedOptions = {...TypeScriptGenerator.defaultOptions, ...options};
    super('TypeScript', realizedOptions);
  }
  
  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit = {
      splitEnum: true, 
      splitObject: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(model: MetaModel): ConstrainedMetaModel {
    return constrainMetaModel(
      this.options.typeMapping, 
      this.options.constraints, 
      {
        metaModel: model,
        options: this.options,
        constrainedName: '' //This is just a placeholder, it will be constrained within the function
      }
    );
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
    const modelDependencies = model.getNearestDependencies();
    //Create the correct dependency imports
    const modelDependencyImports = modelDependencies.map((formattedDependencyModelName) => {
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

    const outputContent = `${[...modelDependencyImports, ...outputModel.dependencies].join('\n')}

${modelCode}`;
    return RenderOutput.toRenderOutput({ result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies });
  }

  render(model: ConstrainedMetaModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    if (model instanceof ConstrainedObjectModel) {
      if (this.options.modelType === 'interface') {
        return this.renderInterface(model, inputModel);
      }
      return this.renderClass(model, inputModel);
    } else if (model instanceof ConstrainedEnumModel) {
      if (this.options.enumType === 'union') {
        return this.renderType(model, inputModel);
      }
      return this.renderEnum(model, inputModel);
    } 
    return this.renderType(model, inputModel);
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

  async renderEnum(model: ConstrainedEnumModel, inputModel: InputMetaModel): Promise<RenderOutput> {
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
