import { AbstractInputProcessor } from './AbstractInputProcessor';
import {
  CommonModel,
  InputMetaModel,
  AvroSchema,
  ProcessorOptions
} from '../models';
import { Logger } from '../utils';
import { Interpreter } from '../interpreter/Interpreter';
import { convertToMetaModel } from '../helpers';

/**
 * Class for processing Avro Schema input
 */
export class AvroSchemaInputProcessor extends AbstractInputProcessor {
  /**
   * Function processing an Avro Schema input
   *
   * @param input
   */

  shouldProcess(input?: any): boolean {
    if (
      input === '' ||
      JSON.stringify(input) === '{}' ||
      JSON.stringify(input) === '[]'
    ) {
      return false;
    }
    if (!input.type) {
      return false;
    }
    return true;
  }

  process(input?: any, options?: ProcessorOptions): Promise<InputMetaModel> {
    if (!this.shouldProcess(input)) {
      return Promise.reject(
        new Error('Input is not an Avro Schema, so it cannot be processed.')
      );
    }
    Logger.debug('Processing input as Avro Schema document');
    const inputModel = new InputMetaModel();
    inputModel.originalInput = input;
    input = AvroSchemaInputProcessor.reflectSchemaNames(
      input,
      {},
      'root',
      true
    ) as any;
    const parsedSchema = AvroSchema.toSchema(input);
    const newCommonModel = AvroSchemaInputProcessor.convertSchemaToCommonModel(
      parsedSchema,
      options
    );
    const metaModel = convertToMetaModel(newCommonModel);
    inputModel.models[metaModel.name] = metaModel;
    Logger.debug('Completed processing input as Avro Schema document');

    return Promise.resolve(inputModel);
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
  static reflectSchemaNames(
    schema: AvroSchema | boolean,
    namesStack: Record<string, number>,
    name?: string,
    isRoot?: boolean
  ): any {
    if (typeof schema === 'boolean') {
      return schema;
    }

    schema = Object.assign({}, schema);
    if (isRoot) {
      namesStack[String(name)] = 0;
      (schema as any)[this.MODELGEN_INFFERED_NAME] = name;
      name = '';
    } else if (
      name &&
      !(schema as any)[this.MODELGEN_INFFERED_NAME]
      //  && schema.$ref === undefined
    ) {
      let occurrence = namesStack[String(name)];
      if (occurrence === undefined) {
        namesStack[String(name)] = 0;
      } else {
        occurrence++;
      }
      const inferredName = occurrence ? `${name}_${occurrence}` : name;
      (schema as any)[this.MODELGEN_INFFERED_NAME] = inferredName;
    }

    if (schema.fields !== undefined) {
      schema.fields = (schema.fields as any[]).map((item: any, idx: number) =>
        this.reflectSchemaNames(
          item,
          namesStack,
          this.ensureNamePattern(name, 'fields', idx)
        )
      );
    }
    if (typeof schema.type === 'object' && schema.type !== undefined) {
      schema.type = this.reflectSchemaNames(
        schema.type,
        namesStack,
        this.ensureNamePattern(name, 'type')
      );
    }
    return schema;
  }

  /**
   * Ensure schema name using previous name and new part
   *
   * @param previousName to concatenate with
   * @param newParts
   */
  private static ensureNamePattern(
    previousName: string | undefined,
    ...newParts: any[]
  ): string {
    const pattern = newParts.map((part) => `${part}`).join('_');
    if (!previousName) {
      return pattern;
    }
    return `${previousName}_${pattern}`;
  }

  static convertSchemaToCommonModel(
    schema: AvroSchema | boolean,
    options?: ProcessorOptions
  ): CommonModel {
    const interpreter = new Interpreter();
    const model = interpreter.interpret(schema as any, options?.interpreter);
    if (model === undefined) {
      throw new Error('Could not interpret schema to internal model');
    }
    return model;
  }
}
