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

export type InterpreterOptions = {
  allowInheritance?: boolean;
  /**
   * For JSON Schema draft 7, additionalProperties are by default true, but it might create an unintended property for the models.
   *
   * Use this option to ignore default additionalProperties for models that has other properties with them.
   *
   * ONLY use this option if you do not have control over your schema files.
   * Instead adapt your schemas to be more strict by setting `additionalProperties: false`.
   */
  ignoreAdditionalProperties?: boolean;
  /**
   * For JSON Schema draft 7, additionalItems are by default true, but it might create an unintended types for arrays.
   *
   * Use this option to ignore default additionalItems for models, as long as there is other types sat for the array.
   *
   * ONLY use this option if you do not have control over the schema files you use to generate the models from.
   * Instead you should adapt your schemas to be more strict by setting `additionalItems: false`.
   */
  ignoreAdditionalItems?: boolean;
};
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
    ignoreAdditionalProperties: false,
    ignoreAdditionalItems: false
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

    interpretPatternProperties(schema, model, this, interpreterOptions);
    interpretAdditionalItems(schema, model, this, interpreterOptions);
    interpretAdditionalProperties(schema, model, this, interpreterOptions);
    interpretItems(schema, model, this, interpreterOptions);
    interpretProperties(schema, model, this, interpreterOptions);
    interpretAllOf(schema, model, this, interpreterOptions);
    interpretOneOf(schema, model, this, interpreterOptions);
    interpretOneOfWithAllOf(schema, model, this, interpreterOptions);
    interpretOneOfWithProperties(schema, model, this, interpreterOptions);
    interpretAnyOf(schema, model, this, interpreterOptions);
    interpretDependencies(schema, model, this, interpreterOptions);
    interpretConst(schema, model);
    interpretEnum(schema, model);

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

    interpretNot(schema, model, this, interpreterOptions);

    //All schemas MUST have ids as we do not know how it will be generated and when it will be needed
    model.$id = interpretName(schema) || `anonymSchema${this.anonymCounter++}`;
  }

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
