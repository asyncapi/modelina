import { CommonInputModel } from '../models';
import { resolve } from 'path';
import ts from 'typescript';
import * as TJS from 'typescript-json-schema';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { AbstractInputProcessor } from './AbstractInputProcessor';

/** Class for processing Typescript code inputs to Common module*/
export class TypeScriptInputProcessor extends AbstractInputProcessor {
  static settings: TJS.PartialArgs = {
    uniqueNames: true,
    required: true
  }; 

  static compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true
  };

  static generateProgram(file: string): ts.Program {
    return TJS.getProgramFromFiles([resolve(file)], TypeScriptInputProcessor.compilerOptions);
  }

  static generateJSONSchema(file: string, typeRequired: string): Array<TJS.Definition> | null {
    const program: ts.Program = TypeScriptInputProcessor.generateProgram(file);
    if (typeRequired === '*') {
      const generator = TJS.buildGenerator(program,this.settings);
      if (!generator) {throw new Error('Cound not generate all types automatically');}
      
      const symbols = generator.getMainFileSymbols(program);
      return symbols.map(symbol => {
        const schema = generator.getSchemaForSymbol(symbol);
        schema.$id = symbol;
        return schema;
      });
    }

    const schema = TJS.generateSchema(program, typeRequired, TypeScriptInputProcessor.settings);
    if (!schema) { return null; }
    schema.$id = typeRequired;
    return [schema];
  }

  shouldProcess(input: Record<string, any>): boolean {
    // checking if input is null
    if ((input === null || undefined) || (input.baseFile === null || undefined)) {
      return false;
    }

    // checking the empty string
    if (Object.keys(input).length === 0 && input.constructor === Object) { return false; }

    //checking if input structure is correct
    if (typeof input !== 'object' || typeof input.baseFile !== 'string') { 
      return false; 
    }

    return true;
  }

  process(input: Record<string, any>): Promise<CommonInputModel> {
    const common = new CommonInputModel();

    if (!this.shouldProcess(input)) {
      return Promise.reject(new Error('Input is not of the valid file format'));
    }

    const { fileContents, baseFile } = input;
    common.originalInput = fileContents;

    // obtain generated schema
    const generatedSchemas = TypeScriptInputProcessor.generateJSONSchema(baseFile, '*');
    if (generatedSchemas) {
      generatedSchemas.map((schema) => {
        const commonModels = JsonSchemaInputProcessor.convertSchemaToCommonModel(schema as Record<string, any>);
        common.models = {...common.models, ...commonModels };
      });
    }
    return Promise.resolve(common);
  }
}

