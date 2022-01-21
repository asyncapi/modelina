import { CommonInputModel } from '../models';
import { resolve } from 'path';
import ts from 'typescript';
import * as fs from 'fs';
import { PartialArgs, CompilerOptions, getProgramFromFiles, generateSchema, Definition, buildGenerator} from 'typescript-json-schema';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';

/** Class for processing Typescript code inputs to Common module*/
export class TypeScriptInputProcessor {
  // trial just to see schema output

  static settings: PartialArgs = {
    uniqueNames: true,
    required: true
  }; 

  static compilerOptions: CompilerOptions = {
    strictNullChecks: true
  };

  static generateProgram(basePath: string, requiredFile: string): ts.Program {
    return getProgramFromFiles([resolve(requiredFile)], TypeScriptInputProcessor.compilerOptions, basePath);
  }

  private generateJSONSchema(basePath: string, Type: string, multiple:boolean): Definition | null {
    const requiredFile = `${basePath }/index.ts`;
    const program: ts.Program = TypeScriptInputProcessor.generateProgram(basePath, requiredFile);

    if (multiple) {
      const generator = buildGenerator(program, TypeScriptInputProcessor.settings);
      if (generator) {
        return generateSchema(program, Type, TypeScriptInputProcessor.settings, [], generator);
      }
    }
  
    return generateSchema(program, Type, TypeScriptInputProcessor.settings);
  }

  process(basePath: string, listofTypes: Array<string>, multiple = false): CommonInputModel {
    const common = new CommonInputModel();
    common.originalInput = fs.readFileSync(`${basePath }/index.ts`, 'utf-8');

    // obtain generated schema from above
    for (const Type of listofTypes) {
      const generatedSchema = this.generateJSONSchema(basePath, Type, multiple) as Record<string, any>;
      const commonModels = JsonSchemaInputProcessor.convertSchemaToCommonModel(generatedSchema);
      common.models = {...common.models, ...commonModels};
    }

    return common;
  }
}

