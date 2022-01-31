import { CommonInputModel } from '../models';
import { resolve } from 'path';
import ts from 'typescript';
import * as fs from 'fs';
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

  static generateProgram(basePath: string, requiredFile: string): ts.Program {
    return TJS.getProgramFromFiles([resolve(requiredFile)], TypeScriptInputProcessor.compilerOptions, basePath);
  }

  static generateJSONSchema(basePath: string, pathToFile: string, typeRequired: string): TJS.Definition | null {
    const program: ts.Program = TypeScriptInputProcessor.generateProgram(basePath, pathToFile);

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
    if ((input === null || undefined) || 
        (input.basePath === null || undefined) || 
        (input.types === null || undefined)) {
      return false;
    }

    // checking the empty string
    if (Object.keys(input).length === 0 && input.constructor === Object) { return false; }

    //checking if input structure is correct
    if (typeof input !== 'object' || typeof input.basePath !== 'string' || input.types.length <= 0) { 
      return false; 
    }
    
    return true;
  }

  process(input: Record<string, any>): Promise<CommonInputModel> {
    const common = new CommonInputModel();

    if (!this.shouldProcess(input)) {
      return Promise.reject(new Error('Input is not of the valid file format'));
    }

    const basePath = input.basePath;
    const types = input.types;

    const indexFile = `${basePath}/index.ts`;
    common.originalInput = fs.readFileSync(indexFile).toString();

    // obtain generated schema
    for (const type of types) {
      const generatedSchema = TypeScriptInputProcessor.generateJSONSchema(basePath, indexFile, type) as Record<string, any>;
      const commonModels = JsonSchemaInputProcessor.convertSchemaToCommonModel(generatedSchema);
      common.models = {...common.models, ...commonModels };
    }
    return Promise.resolve(common);
  }
}

