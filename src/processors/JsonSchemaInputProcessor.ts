import { AbstractInputProcessor } from './AbstractInputProcessor';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import path from 'path';
import { CommonModel, Draft4Schema, Draft7Schema, Draft6Schema, SwaggerV2Schema, OpenapiV3Schema, AsyncapiV2Schema, MetaModel, UnionModel, ObjectModel, DictionaryModel, StringModel, TupleModel, TupleValueModel, ArrayModel, BooleanModel, IntegerModel, FloatModel, EnumModel, EnumValueModel, InputMetaModel} from '../models';
import { Logger } from '../utils';
import { Interpreter } from '../interpreter/Interpreter';

/**
 * Class for processing JSON Schema
 */
export class JsonSchemaInputProcessor extends AbstractInputProcessor {
  /**
   * Function for processing a JSON Schema input.
   * 
   * @param input 
   */
  process(input: Record<string, any>): Promise<InputMetaModel> {
    if (this.shouldProcess(input)) {
      switch (input.$schema) {
      case 'http://json-schema.org/draft-04/schema':
      case 'http://json-schema.org/draft-04/schema#':
        return this.processDraft4(input);
      case 'http://json-schema.org/draft-06/schema':
      case 'http://json-schema.org/draft-06/schema#':
        return this.processDraft6(input);
      case 'http://json-schema.org/draft-07/schema#':
      case 'http://json-schema.org/draft-07/schema':
      default:
        return this.processDraft7(input);
      }
    }
    return Promise.reject(new Error('Input is not a JSON Schema, so it cannot be processed.'));
  }

  /**
   * Unless the schema states one that is not supported we assume its of type JSON Schema
   * 
   * @param input 
   */
  shouldProcess(input: Record<string, any>): boolean {
    if (input.$schema !== undefined) {
      if (input.$schema === 'http://json-schema.org/draft-04/schema#' ||
      input.$schema === 'http://json-schema.org/draft-04/schema' ||
      input.$schema === 'http://json-schema.org/draft-06/schema#' || 
      input.$schema === 'http://json-schema.org/draft-06/schema' ||
      input.$schema === 'http://json-schema.org/draft-07/schema#' || 
      input.$schema === 'http://json-schema.org/draft-07/schema') {
        return true;
      }
      return false;
    }
    return true;
  }

  /**
   * Process a draft-7 schema
   * 
   * @param input to process as draft 7
   */
  private async processDraft7(input: Record<string, any>) : Promise<InputMetaModel> {
    Logger.debug('Processing input as a JSON Schema Draft 7 document');
    const inputMetaModel = new InputMetaModel();
    inputMetaModel.originalInput = input;
    input = JsonSchemaInputProcessor.reflectSchemaNames(input, {}, 'root', true) as Record<string, any>;
    await this.dereferenceInputs(input);
    const parsedSchema = Draft7Schema.toSchema(input);
    const metaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(parsedSchema);
    inputMetaModel.models[metaModel.name] = metaModel;
    Logger.debug('Completed processing input as JSON Schema draft 7 document');
    return inputMetaModel;
  }

  /**
   * Process a draft-4 schema
   * 
   * @param input to process as draft 4
   */
  private async processDraft4(input: Record<string, any>) : Promise<InputMetaModel> {
    Logger.debug('Processing input as JSON Schema Draft 4 document');
    const inputMetaModel = new InputMetaModel();
    inputMetaModel.originalInput = input;
    input = JsonSchemaInputProcessor.reflectSchemaNames(input, {}, 'root', true) as Record<string, any>;
    await this.dereferenceInputs(input);
    const parsedSchema = Draft4Schema.toSchema(input);
    const metaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(parsedSchema);
    inputMetaModel.models[metaModel.name] = metaModel;
    Logger.debug('Completed processing input as JSON Schema draft 4 document');
    return inputMetaModel;
  }
  
  /**
   * Process a draft-6 schema
   * 
   * @param input to process as draft-6
   */
  private async processDraft6(input: Record<string, any>) : Promise<InputMetaModel> {
    Logger.debug('Processing input as a JSON Schema Draft 6 document');
    const inputMetaModel = new InputMetaModel();
    inputMetaModel.originalInput = input;
    input = JsonSchemaInputProcessor.reflectSchemaNames(input, {}, 'root', true) as Record<string, any>;
    await this.dereferenceInputs(input);
    const parsedSchema = Draft6Schema.toSchema(input);
    const metaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(parsedSchema);
    inputMetaModel.models[metaModel.name] = metaModel;
    Logger.debug('Completed processing input as JSON Schema draft 6 document');
    return inputMetaModel;
  }

  private async dereferenceInputs(input: Record<string, any>) {
    Logger.debug('Dereferencing all $ref instances');
    const refParser = new $RefParser;
    // eslint-disable-next-line no-undef
    const localPath = `${process.cwd()}${path.sep}`;
    const deRefOption: $RefParser.Options = {
      continueOnError: true,
      dereference: { circular: true },
    };
    Logger.debug(`Trying to dereference all $ref instances from input, using option ${JSON.stringify(deRefOption)}.`);
    try {
      await refParser.dereference(localPath, input, deRefOption);
    } catch (e: any) {
      const errorMessage = `Could not dereference $ref in input, is all the references correct? ${e.message}`;
      Logger.error(errorMessage, e);
      throw new Error(errorMessage);
    }
    Logger.debug('Successfully dereferenced all $ref instances from input.', input);
  }

  /**
   * Each schema must have a name, so when later interpreted, the model have the most accurate model name.
   * 
   * Reflect name from given schema and save it to `x-modelgen-inferred-name` extension.
   * 
   * This reflects all the common keywords that are shared between draft-4, draft-7 and Swagger 2.0 Schema
   * 
   * @param schema to process
   * @param namesStack is a aggegator of previous used names
   * @param name to infer
   * @param isRoot indicates if performed schema is a root schema
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  static reflectSchemaNames(
    schema: Draft4Schema | Draft6Schema | Draft7Schema | SwaggerV2Schema | OpenapiV3Schema | boolean,
    namesStack: Record<string, number>,
    name?: string,
    isRoot?: boolean,
  ): any {
    if (typeof schema === 'boolean') {return schema;}

    schema = Object.assign({}, schema);
    if (isRoot) {
      namesStack[String(name)] = 0;
      (schema as any)[this.MODELGEN_INFFERED_NAME] = name;
      name = '';
    } else if (name && !(schema as any)[this.MODELGEN_INFFERED_NAME]) {
      let occurrence = namesStack[String(name)];
      if (occurrence === undefined) {
        namesStack[String(name)] = 0;
      } else {
        occurrence++;
      }
      const inferredName = occurrence ? `${name}_${occurrence}` : name;
      (schema as any)[this.MODELGEN_INFFERED_NAME] = inferredName;
    }

    if (schema.allOf !== undefined) {
      schema.allOf = (schema.allOf as any[]).map((item: any, idx: number) => this.reflectSchemaNames(item, namesStack, this.ensureNamePattern(name, 'allOf', idx)));
    }
    if (schema.oneOf !== undefined) {
      schema.oneOf = (schema.oneOf as any[]).map((item: any, idx: number) => this.reflectSchemaNames(item, namesStack, this.ensureNamePattern(name, 'oneOf', idx)));
    }
    if (schema.anyOf !== undefined) {
      schema.anyOf = (schema.anyOf as any[]).map((item: any, idx: number) => this.reflectSchemaNames(item, namesStack, this.ensureNamePattern(name, 'anyOf', idx)));
    }
    if (schema.not !== undefined) {
      schema.not = this.reflectSchemaNames(schema.not, namesStack, this.ensureNamePattern(name, 'not'));
    }
    if (
      typeof schema.additionalItems === 'object' &&
      schema.additionalItems !== undefined
    ) {
      schema.additionalItems = this.reflectSchemaNames(schema.additionalItems, namesStack, this.ensureNamePattern(name, 'additionalItem'));
    }
    if (
      typeof schema.additionalProperties === 'object' && 
      schema.additionalProperties !== undefined
    ) {
      schema.additionalProperties = this.reflectSchemaNames(schema.additionalProperties, namesStack, this.ensureNamePattern(name, 'additionalProperty'));
    }
    if (schema.items !== undefined) {
      if (Array.isArray(schema.items)) {
        schema.items = (schema.items as any[]).map((item: Draft7Schema | boolean, idx: number) => this.reflectSchemaNames(item, namesStack, this.ensureNamePattern(name, 'item', idx)));
      } else {
        schema.items = this.reflectSchemaNames(schema.items, namesStack, this.ensureNamePattern(name, 'item'));
      }
    }

    if (schema.properties !== undefined) {
      const properties : any = {};
      for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
        properties[String(propertyName)] = this.reflectSchemaNames(propertySchema, namesStack, this.ensureNamePattern(name, propertyName));
      }
      schema.properties = properties;
    }
    if (schema.dependencies !== undefined) {
      const dependencies: any = {};
      for (const [dependencyName, dependency] of Object.entries(schema.dependencies)) {
        if (typeof dependency === 'object' && !Array.isArray(dependency)) {
          dependencies[String(dependencyName)] = this.reflectSchemaNames(dependency as any, namesStack, this.ensureNamePattern(name, dependencyName));
        } else {
          dependencies[String(dependencyName)] = dependency as string[];
        }
      }
      schema.dependencies = dependencies;
    }
    if (schema.patternProperties !== undefined) {
      const patternProperties: any = {};
      for (const [idx, [patternPropertyName, patternProperty]] of Object.entries(Object.entries(schema.patternProperties))) {
        patternProperties[String(patternPropertyName)] = this.reflectSchemaNames(patternProperty as any, namesStack, this.ensureNamePattern(name, 'pattern_property', idx));
      }
      schema.patternProperties = patternProperties;
    }
    if (schema.definitions !== undefined) {
      const definitions: { [key: string]: any } = {};
      for (const [definitionName, definition] of Object.entries(schema.definitions)) {
        definitions[String(definitionName)] = this.reflectSchemaNames(definition, namesStack, this.ensureNamePattern(name, definitionName));
      }
      schema.definitions = definitions;
    }

    if (!(schema instanceof Draft4Schema)) {
      //Keywords introduced in draft 6
      if (schema.contains !== undefined) {
        schema.contains = this.reflectSchemaNames(schema.contains, namesStack, this.ensureNamePattern(name, 'contain'));
      }
      if (schema.propertyNames !== undefined) {
        schema.propertyNames = this.reflectSchemaNames(schema.propertyNames, namesStack, this.ensureNamePattern(name, 'propertyName'));
      }
      if (!(schema instanceof Draft6Schema)) {
        //Keywords introduced in Draft 7
        if (schema.if !== undefined) {
          schema.if = this.reflectSchemaNames(schema.if, namesStack, this.ensureNamePattern(name, 'if'));
        }
        if (schema.then !== undefined) {
          schema.then = this.reflectSchemaNames(schema.then, namesStack, this.ensureNamePattern(name, 'then'));
        }
        if (schema.else !== undefined) {
          schema.else = this.reflectSchemaNames(schema.else, namesStack, this.ensureNamePattern(name, 'else'));
        }
      }
    }
    return schema;
  }

  /**
   * Ensure schema name using previous name and new part
   * 
   * @param previousName to concatenate with
   * @param newParts
   */
  private static ensureNamePattern(previousName: string | undefined, ...newParts: any[]): string {
    const pattern = newParts.map(part => `${part}`).join('_');
    if (!previousName) {
      return pattern;
    }
    return `${previousName}_${pattern}`;
  }

  /**
   * Simplifies a JSON Schema into a common models
   * 
   * @param schema to simplify to common model
   */
  static convertSchemaToMetaModel(schema: Draft4Schema | Draft6Schema | Draft7Schema | SwaggerV2Schema| AsyncapiV2Schema | boolean): MetaModel {
    const interpreter = new Interpreter();
    const jsonSchemaModel = interpreter.interpret(schema);
    if (jsonSchemaModel === undefined) {
      throw new Error('Could not convert JSON Schema to model');
    }
    return this.convertToMetaModel(jsonSchemaModel);
  }
  static convertToMetaModel(jsonSchemaModel: CommonModel): MetaModel {
    // What to do here?
    const modelName = jsonSchemaModel.$id || 'undefined';

    // Has multiple types, so convert to union
    if (Array.isArray(jsonSchemaModel.type) && jsonSchemaModel.type.length > 1) {
      const unionModel = new UnionModel(modelName);
      const stringModel = this.convertToStringModel(jsonSchemaModel, modelName);
      if (stringModel !== undefined) {
        unionModel.unionModels.push(stringModel);
      }
      const floatModel = this.convertToFloatModel(jsonSchemaModel, modelName);
      if (floatModel !== undefined) {
        unionModel.unionModels.push(floatModel);
      }
      const integerModel = this.convertToIntegerModel(jsonSchemaModel, modelName);
      if (integerModel !== undefined) {
        unionModel.unionModels.push(integerModel);
      }
      const enumModel = this.convertToEnumModel(jsonSchemaModel, modelName);
      if (enumModel !== undefined) {
        unionModel.unionModels.push(enumModel);
      }
      const booleanModel = this.convertToBooleanModel(jsonSchemaModel, modelName);
      if (booleanModel !== undefined) {
        unionModel.unionModels.push(booleanModel);
      }
      const objectModel = this.convertToObjectModel(jsonSchemaModel, modelName);
      if (objectModel !== undefined) {
        unionModel.unionModels.push(objectModel);
      }
      const arrayModel = this.convertToListModel(jsonSchemaModel, modelName);
      if (arrayModel !== undefined) {
        unionModel.unionModels.push(arrayModel);
      }
      return unionModel;
    }
    const stringModel = this.convertToStringModel(jsonSchemaModel, modelName);
    if (stringModel !== undefined) {
      return stringModel;
    }
    const floatModel = this.convertToFloatModel(jsonSchemaModel, modelName);
    if (floatModel !== undefined) {
      return floatModel;
    }
    const integerModel = this.convertToIntegerModel(jsonSchemaModel, modelName);
    if (integerModel !== undefined) {
      return integerModel;
    }
    const enumModel = this.convertToEnumModel(jsonSchemaModel, modelName);
    if (enumModel !== undefined) {
      return enumModel;
    }
    const booleanModel = this.convertToBooleanModel(jsonSchemaModel, modelName);
    if (booleanModel !== undefined) {
      return booleanModel;
    }
    const objectModel = this.convertToObjectModel(jsonSchemaModel, modelName);
    if (objectModel !== undefined) {
      return objectModel;
    }
    const arrayModel = this.convertToListModel(jsonSchemaModel, modelName);
    if (arrayModel !== undefined) {
      return arrayModel;
    }
    throw new Error('Failed to convert to MetaModel')
  }
  static convertToStringModel(jsonSchemaModel: CommonModel, name: string): MetaModel | undefined {
    if(!jsonSchemaModel.type?.includes('string')) {
      return undefined;
    }
    let metaModel = new StringModel(name);
    metaModel.originalInput = jsonSchemaModel.originalInput;
    return metaModel;
  }
  static convertToIntegerModel(jsonSchemaModel: CommonModel, name: string): MetaModel | undefined {
    if(!jsonSchemaModel.type?.includes('integer')) {
      return undefined;
    }
    let metaModel = new IntegerModel(name);
    metaModel.originalInput = jsonSchemaModel.originalInput;
    return metaModel;
  }
  static convertToFloatModel(jsonSchemaModel: CommonModel, name: string): MetaModel | undefined {
    if(!jsonSchemaModel.type?.includes('number')) {
      return undefined;
    }
    let metaModel = new FloatModel(name);
    metaModel.originalInput = jsonSchemaModel.originalInput;
    return metaModel;
  }
  static convertToEnumModel(jsonSchemaModel: CommonModel, name: string): MetaModel | undefined {
    if(!Array.isArray(jsonSchemaModel.enum)) {
      return undefined;
    }
    let metaModel = new EnumModel(name);
    for (const enumValue of jsonSchemaModel.enum) {
      const enumValueModel = new EnumValueModel(JSON.stringify(enumValue), enumValue);
      metaModel.values.push(enumValueModel);
    }
    metaModel.originalInput = jsonSchemaModel.originalInput;
    return metaModel;
  }
  static convertToBooleanModel(jsonSchemaModel: CommonModel, name: string): MetaModel | undefined {
    if(!jsonSchemaModel.type?.includes('boolean')) {
      return undefined;
    }
    let metaModel = new BooleanModel(name);
    metaModel.originalInput = jsonSchemaModel.originalInput;
    return metaModel;
  }
  static convertToObjectModel(jsonSchemaModel: CommonModel, name: string): MetaModel | undefined {
    if(!jsonSchemaModel.type?.includes('object')) {
      return undefined;
    }
    let metaModel = new ObjectModel(name);
    metaModel.originalInput = jsonSchemaModel.originalInput;
    metaModel.properties = {};
    for (const [propertyName, prop] of Object.entries(jsonSchemaModel.properties || {}) ) {
      metaModel.properties[propertyName] = JsonSchemaInputProcessor.convertToMetaModel(prop);
    }
    
    // TODO: recursively find "correct" name
    if (jsonSchemaModel.additionalProperties !== undefined) {
      const propertyName = 'additionalProperties';
      if (metaModel.properties[propertyName] === undefined) {
        const keyModel = new StringModel(propertyName);
        const valueModel = JsonSchemaInputProcessor.convertToMetaModel(jsonSchemaModel.additionalProperties);
        const dictionaryModel = new DictionaryModel(propertyName, keyModel, valueModel);
        dictionaryModel.serializationType = 'unwrap';
        dictionaryModel.originalInput = jsonSchemaModel.originalInput;
        metaModel.properties[propertyName] = dictionaryModel;
      } else {
        throw new Error('Property already exists')
      }
    }

    if (jsonSchemaModel.patternProperties !== undefined) {
      for (const [pattern, patternModel] of Object.entries(jsonSchemaModel.patternProperties)) {
        const propertyName = `${pattern}_PatternProperty`;
        if (metaModel.properties[propertyName] === undefined) {
          const keyModel = new StringModel(propertyName);
          // TODO: Add format to string model to match regex
          const valueModel = JsonSchemaInputProcessor.convertToMetaModel(patternModel);
          const dictionaryModel = new DictionaryModel(propertyName, keyModel, valueModel);
          dictionaryModel.serializationType = 'unwrap';
          dictionaryModel.originalInput = jsonSchemaModel.originalInput;
          metaModel.properties[propertyName] = dictionaryModel;
        } else {
          throw new Error('Property already exists')
        }
      }
    }
    return metaModel;
  }

  static convertToListModel(jsonSchemaModel: CommonModel, name: string): MetaModel | undefined {
    if(!jsonSchemaModel.type?.includes('array')) {
      return undefined;
    }

    if (Array.isArray(jsonSchemaModel.items) && jsonSchemaModel.additionalItems === undefined) {
      //item multiple types + additionalItems not sat = tuple of item type
      const tupleModel = new TupleModel(name);
      tupleModel.tupleModels = [];
      tupleModel.originalInput = jsonSchemaModel.originalInput;
      for (let i = 0; i < jsonSchemaModel.items.length ; i++) {
        const item = jsonSchemaModel.items[i];
        const valueModel = JsonSchemaInputProcessor.convertToMetaModel(item);
        const tupleValueModel = new TupleValueModel(i, valueModel);
        tupleModel.tupleModels[i] = tupleValueModel;
      }
      return tupleModel;
    } else {
      //item multiple types + additionalItems sat = both count, as normal array
      //item single type + additionalItems sat = contradicting, only items count, as normal array
      //item not sat + additionalItems sat = anything is allowed, as normal array
      //item single type + additionalItems not sat = normal array
      //item not sat + additionalItems not sat = normal array, any type
      if (!Array.isArray(jsonSchemaModel.items) && jsonSchemaModel.additionalItems === undefined && jsonSchemaModel.items !== undefined) {
        const valueModel = JsonSchemaInputProcessor.convertToMetaModel(jsonSchemaModel.items);
        return new ArrayModel(name, valueModel);
      } else {
        const valueModel = new UnionModel('');
        for (const itemModel of Array.isArray(jsonSchemaModel.items) ? jsonSchemaModel.items : [] ) {
          const itemsModel = JsonSchemaInputProcessor.convertToMetaModel(itemModel);
          valueModel.unionModels.push(itemsModel);
        }
        if(jsonSchemaModel.additionalItems !== undefined) {
          //Union model between the two
          const itemsModel = JsonSchemaInputProcessor.convertToMetaModel(jsonSchemaModel.additionalItems);
          valueModel.unionModels.push(itemsModel);
        }
        return new ArrayModel(name, valueModel);
      }
    }

  }
}
