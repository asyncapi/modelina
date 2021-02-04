import { AbstractInputProcessor } from './AbstractInputProcessor';
import { CommonInputModel } from '../models/CommonInputModel';
import { CommonModel } from '../models/CommonModel'
import Simplifier from '../simplification/Simplifier';
import { Schema } from '../models/Schema';
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
     * @param input to process as draft 7
     */
    private processDraft7(input: any) : CommonInputModel {
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
