import { InputMetaModel, ProcessorOptions } from '../models';
import { resolve } from 'path';
import ts from 'typescript';
import * as TJS from 'typescript-json-schema';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { AbstractInputProcessor } from './AbstractInputProcessor';
import { Logger } from '../utils';

/** Class for processing Typescript code inputs to Common module*/
export interface TypeScriptInputProcessorOptions extends TJS.PartialArgs {
  uniqueNames?: boolean;
  required?: boolean;
  compilerOptions?: TJS.CompilerOptions;
}
export class TypeScriptInputProcessor extends AbstractInputProcessor {
  static settings: TypeScriptInputProcessorOptions = {
    uniqueNames: false,
    required: true,
    compilerOptions: {
      strictNullChecks: false
    }
  };

  private generateProgram(file: string): ts.Program {
    return TJS.getProgramFromFiles(
      [resolve(file)],
      TypeScriptInputProcessor.settings.compilerOptions
    );
  }

  private generateJSONSchema(
    file: string,
    typeRequired: string,
    options?: TypeScriptInputProcessorOptions
  ): Array<TJS.Definition> | null {
    const mergedOptions = {
      ...TypeScriptInputProcessor.settings,
      ...options
    };

    const program: ts.Program = this.generateProgram(file);
    if (typeRequired === '*') {
      const generator = TJS.buildGenerator(program, mergedOptions);
      if (!generator) {
        throw new Error('Cound not generate all types automatically');
      }

      const symbols = generator.getMainFileSymbols(program);
      return symbols.map((symbol) => {
        const schemaFromGenerator = generator.getSchemaForSymbol(symbol);
        schemaFromGenerator.$id = symbol;
        return schemaFromGenerator;
      });
    }

    const schema = TJS.generateSchema(program, typeRequired, mergedOptions);
    if (!schema) {
      return null;
    }
    schema.$id = typeRequired;
    return [schema];
  }

  shouldProcess(input: any): boolean {
    // checking if input is null
    if (input === null || undefined || input.baseFile === null || undefined) {
      return false;
    }

    // checking the empty string
    if (Object.keys(input).length === 0 && input.constructor === Object) {
      return false;
    }

    //checking if input structure is correct
    if (typeof input !== 'object' || typeof input.baseFile !== 'string') {
      return false;
    }

    return true;
  }

  process(input: any, options?: ProcessorOptions): Promise<InputMetaModel> {
    const inputModel = new InputMetaModel();

    if (!this.shouldProcess(input)) {
      return Promise.reject(new Error('Input is not of the valid file format'));
    }

    const { fileContents, baseFile } = input;
    inputModel.originalInput = fileContents;

    // obtain generated schema
    const generatedSchemas = this.generateJSONSchema(
      baseFile,
      '*',
      options?.typescript
    );
    if (generatedSchemas) {
      for (const schema of generatedSchemas) {
        const newMetaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(
          schema as any,
          options
        );
        if (inputModel.models[newMetaModel.name] !== undefined) {
          Logger.warn(
            `Overwriting existing model with name ${newMetaModel.name}, are there two models with the same name present? Overwriting the old model.`,
            newMetaModel.name
          );
        }
        inputModel.models[newMetaModel.name] = newMetaModel;
      }
    }
    return Promise.resolve(inputModel);
  }
}
