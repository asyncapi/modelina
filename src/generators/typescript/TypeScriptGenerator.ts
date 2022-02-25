import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
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
  exportType?: 'default' | 'named';
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
  async renderCompleteModel(model: CommonModel, inputModel: CommonInputModel, options: TypeScriptRenderCompleteModelOptions): Promise<RenderOutput> {
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

    const {moduleSystem = "ESM", exportType = "default"} = options;

    //Create the correct dependency imports
    modelDependencies = modelDependencies.map(
      (dependencyName) => {
        const dependencyObject =
          exportType === "named" ? `{${dependencyName}}` : dependencyName;

        return moduleSystem === "CJS"
          ? `const ${dependencyObject} = require('./${dependencyName}');`
          : `import ${dependencyObject} from './${dependencyName}';`;
      }
    );

    //Ensure we expose the model correctly, based on the module system
    const cjsExport =
      exportType === 'default'
        ? `module.exports = ${outputModel.renderedName};`
        : `exports.${outputModel.renderedName} = ${outputModel.renderedName};`;
    const esmExport =
      exportType === 'default'
        ? `export default ${outputModel.renderedName};\n`
        : '';
    const modelCode = `${
      moduleSystem === 'ESM' && exportType === 'named' ? 'export ' : ''
    }${outputModel.result}\n${moduleSystem === 'CJS' ? cjsExport : esmExport}`;

    const outputContent = `${[...modelDependencies, ...outputModel.dependencies].join('\n')}

${modelCode}`;
    return RenderOutput.toRenderOutput({ result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies });
  }

  render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const kind = TypeHelpers.extractKind(model);
    switch (kind) {
    case ModelKind.OBJECT: {
      return this.renderModelType(model, inputModel);
    }
    case ModelKind.ENUM: {
      if (this.options.enumType === 'union') {
        return this.renderType(model, inputModel);
      }
      return this.renderEnum(model, inputModel);
    }
    default: return this.renderType(model, inputModel);
    }
  }

  async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('class'); 
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
  }

  async renderInterface(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('interface'); 
    const renderer = new InterfaceRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
  }

  async renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum'); 
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
  }

  async renderType(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('type'); 
    const renderer = new TypeRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
  }

  private renderModelType(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const modelType = this.options.modelType;
    if (modelType === 'interface') {
      return this.renderInterface(model, inputModel);
    }
    return this.renderClass(model, inputModel);
  }
}
