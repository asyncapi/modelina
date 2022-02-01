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

  static generateProgram(requiredFile: string): ts.Program {
    return TJS.getProgramFromFiles([resolve(requiredFile)], TypeScriptInputProcessor.compilerOptions);
  }

  static generateJSONSchema(pathToFile: string, typeRequired: string): TJS.Definition | null {
    const program: ts.Program = TypeScriptInputProcessor.generateProgram(pathToFile);

    // if (multipleFiles) {
    //   const generator = TJS.buildGenerator(program, TypeScriptInputProcessor.settings);
    //   if (generator) {
    //     return TJS.generateSchema(program, typeRequired, TypeScriptInputProcessor.settings, [], generator);
    //   }
    // }
  
    return TJS.generateSchema(program, typeRequired, TypeScriptInputProcessor.settings);
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

    const { baseFile } = input;
    common.originalInput = baseFile;

    // obtain generated schema
    const generatedSchema = TypeScriptInputProcessor.generateJSONSchema(baseFile, '*') as Record<string, any>;
    const commonModels = JsonSchemaInputProcessor.convertSchemaToCommonModel(generatedSchema);
    common.models = {...common.models, ...commonModels };
    return Promise.resolve(common);
  }
}

