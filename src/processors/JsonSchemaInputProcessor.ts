import { AbstractInputProcessor } from './AbstractInputProcessor';
import { CommonInputModel } from '../models/CommonInputModel';
import { CommonModel } from '../models/CommonModel'
import Simplifier from '../simplification/Simplifier';
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
        if(input.$schema !== undefined){
            switch(input.$schema){
                case 'http://json-schema.org/draft-07/schema#':
                    return await this.processDraft7(input);
                default: 
                    throw "Input not supported"
            }
        }else{
            return await this.processDraft7(input);
        }
    }

    /**
     * Process a draft 7 schema
     * @param input to process as draft 7
     */
    private async processDraft7(input: any) : Promise<CommonInputModel> {
        const refParser = new $RefParser;
        const localPath = `${process.cwd()}${path.sep}`;
        await refParser.dereference(localPath, 
            input, {
            continueOnError: true,
            dereference: { circular: 'ignore' },
        });
        const schema = Schema.toSchema(input);
        const commonInputModel = new CommonInputModel();
        commonInputModel.originalInput = schema;
        commonInputModel.models = JsonSchemaInputProcessor.convertSchemaToCommonModel(input);
        return commonInputModel;
    }

    /**
     * Simplifies a JSON Schema into a common models
     * 
     * @param schema to simplify to common model
     */
    static convertSchemaToCommonModel(schema: Schema | boolean) : {[key: string]: CommonModel} {
        const simplifier = new Simplifier();
        const commonModels = simplifier.simplify(schema);
        const commonModelsMap : {[key: string]: CommonModel}  = {};
        commonModels.forEach((value) => {
            if(value.$id){
                commonModelsMap[value.$id] = value;
            }else{
                console.log("Looks like someone is missing an id");
            }
        });
        return commonModelsMap;
    }
}
