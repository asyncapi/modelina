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
    if (typeof input !== 'object' || typeof input.basePath !== 'string') {return false;}
    return true;
  }

  process(input: Record<string, any>): Promise<CommonInputModel> {
    const common = new CommonInputModel();
    for (const [, value] of Object.entries(input)) {
      if (!this.shouldProcess(value)) { 
        return Promise.reject(new Error('Input is not of the valid file format.')); 
      }

      const indexFile = `${value.basePath}/index.ts`;
      common.originalInput = fs.readFileSync(indexFile).toString();

      // obtain generated schema
      for (const type of value.types) {
        const generatedSchema = TypeScriptInputProcessor.generateJSONSchema(value.basePath, indexFile, type) as Record<string, any>;
        const commonModels = JsonSchemaInputProcessor.convertSchemaToCommonModel(generatedSchema);
        common.models = {...common.models, ...commonModels };
      }
    }
    // console.log(JSON.stringify(common));
    return Promise.resolve(common);
  }
}

