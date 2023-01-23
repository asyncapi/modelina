import {
  CommonModel,
  Draft6Schema,
  Draft4Schema,
  SwaggerV2Schema,
  AsyncapiV2Schema,
  Draft7Schema
} from '../models';
import { interpretName } from './Utils';
import interpretProperties from './InterpretProperties';
import interpretAllOf from './InterpretAllOf';
import interpretConst from './InterpretConst';
import interpretEnum from './InterpretEnum';
import interpretAdditionalProperties from './InterpretAdditionalProperties';
import interpretItems from './InterpretItems';
import interpretPatternProperties from './InterpretPatternProperties';
import interpretNot from './InterpretNot';
import interpretDependencies from './InterpretDependencies';
import interpretAdditionalItems from './InterpretAdditionalItems';
import interpretOneOf from './InterpretOneOf';
import interpretAnyOf from './InterpretAnyOf';
import interpretOneOfWithAllOf from './InterpretOneOfWithAllOf';
import interpretOneOfWithProperties from './InterpretOneOfWithProperties';

/* eslint-disable no-use-before-define */
export type InterpreterComplexFunc = (
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  options?: InterpreterOptions
) => void;
export type InterpreterFunc = (
  schema: InterpreterSchemaType,
  model: CommonModel
) => void;
export type InterpreterOptions = {
  allowInheritance?: boolean;
  patternProperties?: InterpreterComplexFunc;
  additionalProperties?: InterpreterComplexFunc;
  additionalItems?: InterpreterComplexFunc;
  items?: InterpreterComplexFunc;
  properties?: InterpreterComplexFunc;
  allOf?: InterpreterComplexFunc;
  oneOf?: InterpreterComplexFunc;
  oneOfWithAllOf?: InterpreterComplexFunc;
  oneOfWithProperties?: InterpreterComplexFunc;
  anyOf?: InterpreterComplexFunc;
  dependencies?: InterpreterComplexFunc;
  not?: InterpreterComplexFunc;
  const?: InterpreterFunc;
  enum?: InterpreterFunc;
};
/* eslint-enable no-use-before-define */
export type InterpreterSchemas =
  | Draft6Schema
  | Draft4Schema
  | Draft7Schema
  | SwaggerV2Schema
  | AsyncapiV2Schema;
export type InterpreterSchemaType = InterpreterSchemas | boolean;

export class Interpreter {
  static defaultInterpreterOptions: InterpreterOptions = {
    allowInheritance: false,
    patternProperties: interpretPatternProperties,
    additionalProperties: interpretAdditionalProperties,
    additionalItems: interpretAdditionalItems,
    items: interpretItems,
    properties: interpretProperties,
    allOf: interpretAllOf,
    oneOf: interpretOneOf,
    oneOfWithAllOf: interpretOneOfWithAllOf,
    oneOfWithProperties: interpretOneOfWithProperties,
    anyOf: interpretAnyOf,
    dependencies: interpretDependencies,
    not: interpretNot,
    const: interpretConst,
    enum: interpretEnum
  };

  private anonymCounter = 1;
  private seenSchemas: Map<InterpreterSchemaType, CommonModel> = new Map();

  /**
   * Transforms a schema into instances of CommonModel by processing all keywords from schema documents and infers the model definition.
   *
   * @param schema
   * @param interpreterOptions to control the interpret process
   */
  interpret(
    schema: InterpreterSchemaType,
    options: InterpreterOptions = Interpreter.defaultInterpreterOptions
  ): CommonModel | undefined {
    if (this.seenSchemas.has(schema)) {
      const cachedModel = this.seenSchemas.get(schema);
      if (cachedModel !== undefined) {
        return cachedModel;
      }
    }
    //If it is a false validation schema return no CommonModel
    if (schema === false) {
      return undefined;
    }
    const model = new CommonModel();
    model.originalInput = schema;
    this.seenSchemas.set(schema, model);
    this.interpretSchema(model, schema, options);
    return model;
  }

  /**
   * Function to interpret a schema into a CommonModel.
   *
   * @param model
   * @param schema
   * @param interpreterOptions to control the interpret process
   */
  private interpretSchema(
    model: CommonModel,
    schema: InterpreterSchemaType,
    interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
  ) {
    if (schema === true) {
      model.setType([
        'object',
        'string',
        'number',
        'array',
        'boolean',
        'null',
        'integer'
      ]);
    } else if (typeof schema === 'object') {
      this.interpretSchemaObject(model, schema, interpreterOptions);
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private interpretSchemaObject(
    model: CommonModel,
    schema: InterpreterSchemas,
    interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
  ) {
    if (schema.type !== undefined) {
      model.addTypes(schema.type);
    }
    if (schema.required !== undefined) {
      model.required = schema.required;
    }

    const defaultInterpreterOptions = Interpreter.defaultInterpreterOptions;
    const patternPropertiesFunc = (interpreterOptions.patternProperties ||
      defaultInterpreterOptions.patternProperties) as InterpreterComplexFunc;
    const additionalPropertiesFunc = (interpreterOptions.additionalProperties ||
      defaultInterpreterOptions.additionalProperties) as InterpreterComplexFunc;
    const additionalItemsFunc = (interpreterOptions.additionalItems ||
      defaultInterpreterOptions.additionalItems) as InterpreterComplexFunc;
    const itemsFunc = (interpreterOptions.items ||
      defaultInterpreterOptions.items) as InterpreterComplexFunc;
    const propertiesFunc = (interpreterOptions.properties ||
      defaultInterpreterOptions.properties) as InterpreterComplexFunc;
    const allOfFunc = (interpreterOptions.allOf ||
      defaultInterpreterOptions.allOf) as InterpreterComplexFunc;
    const oneOfFunc = (interpreterOptions.oneOf ||
      defaultInterpreterOptions.oneOf) as InterpreterComplexFunc;
    const oneOfWithAllOfFunc = (interpreterOptions.oneOfWithAllOf ||
      defaultInterpreterOptions.oneOfWithAllOf) as InterpreterComplexFunc;
    const oneOfWithPropertiesFunc = (interpreterOptions.oneOfWithProperties ||
      defaultInterpreterOptions.oneOfWithProperties) as InterpreterComplexFunc;
    const anyOfFunc = (interpreterOptions.anyOf ||
      defaultInterpreterOptions.anyOf) as InterpreterComplexFunc;
    const dependenciesFunc = (interpreterOptions.dependencies ||
      defaultInterpreterOptions.dependencies) as InterpreterComplexFunc;
    const constFunc = (interpreterOptions.const ||
      defaultInterpreterOptions.const) as InterpreterFunc;
    const enumFunc = (interpreterOptions.enum ||
      defaultInterpreterOptions.enum) as InterpreterFunc;
    const notFunc = (interpreterOptions.not ||
      defaultInterpreterOptions.not) as InterpreterComplexFunc;

    patternPropertiesFunc(schema, model, this, interpreterOptions);
    additionalPropertiesFunc(schema, model, this, interpreterOptions);
    additionalItemsFunc(schema, model, this, interpreterOptions);
    itemsFunc(schema, model, this, interpreterOptions);
    propertiesFunc(schema, model, this, interpreterOptions);
    allOfFunc(schema, model, this, interpreterOptions);
    oneOfFunc(schema, model, this, interpreterOptions);
    oneOfWithAllOfFunc(schema, model, this, interpreterOptions);
    oneOfWithPropertiesFunc(schema, model, this, interpreterOptions);
    anyOfFunc(schema, model, this, interpreterOptions);
    dependenciesFunc(schema, model, this, interpreterOptions);
    constFunc(schema, model);
    enumFunc(schema, model);

    if (
      !(schema instanceof Draft4Schema) &&
      !(schema instanceof Draft6Schema)
    ) {
      this.interpretAndCombineSchema(
        schema.then,
        model,
        schema,
        interpreterOptions
      );
      this.interpretAndCombineSchema(
        schema.else,
        model,
        schema,
        interpreterOptions
      );
    }

    notFunc(schema, model, this, interpreterOptions);

    //All schemas MUST have ids as we do not know how it will be generated and when it will be needed
    model.$id = interpretName(schema) || `anonymSchema${this.anonymCounter++}`;
  }
  /* eslint-enable sonarjs/cognitive-complexity */

  /**
   * Go through a schema and combine the interpreted models together.
   *
   * @param schema to go through
   * @param currentModel the current output
   * @param rootSchema the root schema to use as original schema when merged
   * @param interpreterOptions to control the interpret process
   */
  interpretAndCombineSchema(
    schema: InterpreterSchemaType | undefined,
    currentModel: CommonModel,
    rootSchema: any,
    interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
  ): void {
    if (typeof schema !== 'object') {
      return;
    }
    const model = this.interpret(schema, interpreterOptions);
    if (model !== undefined) {
      CommonModel.mergeCommonModels(currentModel, model, rootSchema);
    }
  }
}
