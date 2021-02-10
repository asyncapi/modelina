import { AbstractInputProcessor } from './AbstractInputProcessor';
import { CommonInputModel } from '../models/CommonInputModel';
import { CommonModel } from '../models/CommonModel'
import {simplify} from '../simplification/Simplifier';
import { Schema } from '../models/Schema';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import path from 'path';
/**
 * Class for processing JSON Schema
 */
export class JsonSchemaInputProcessor extends AbstractInputProcessor {

    /**
     * Function for processing a JSON Schema input.
     * 
     * @param input 
     */
    async process(input: any): Promise<CommonInputModel> {
        if(this.shouldProcess(input)){
            if(input.$schema !== undefined){
                switch(input.$schema){
                    case 'http://json-schema.org/draft-07/schema#':
                        return this.processDraft7(input);
                }
            }else{
                return this.processDraft7(input);
            }
        }
        throw "Input is not a JSON Schema, so it cannot be processed."
    }


    /**
     * Unless the schema states one that is not supported we assume its of type JSON Schema
     * 
     * @param input 
     */
    shouldProcess(input: any): boolean {
        if(input.$schema !== undefined){
            switch(input.$schema){
                case 'http://json-schema.org/draft-07/schema#':
                    return true;
                default: 
                    return false;
            }
        }
        return true;
    }

    /**
     * Process a draft 7 schema
     * 
     * @param input to process as draft 7
     */
    private async processDraft7(input: any) : Promise<CommonInputModel> {
        const refParser = new $RefParser;
        const commonInputModel = new CommonInputModel();
        const localPath = `${process.cwd()}${path.sep}`;
        commonInputModel.originalInput = Schema.toSchema(input);
        await refParser.dereference(localPath, 
            input, {
            continueOnError: true,
            dereference: { circular: 'ignore' },
        });
        const parsedSchema = Schema.toSchema(input);
        if (refParser.$refs.circular && typeof parsedSchema !== "boolean"){
          await refParser.dereference(localPath,
            parsedSchema, {
            continueOnError: true,
            dereference: { circular: true },
          });
        }
        commonInputModel.models = JsonSchemaInputProcessor.convertSchemaToCommonModel(parsedSchema);
        return commonInputModel;
    }

    /**
     * Simplifies a JSON Schema into a common models
     * 
     * @param schema to simplify to common model
     */
    static convertSchemaToCommonModel(schema: Schema | boolean) : {[key: string]: CommonModel} {
        const commonModels = simplify(schema);
        const commonModelsMap : {[key: string]: CommonModel}  = {};
        commonModels.forEach((value) => {
            if(value.$id){
                commonModelsMap[value.$id] = value;
            }
        });
        return commonModelsMap;
    }
}
