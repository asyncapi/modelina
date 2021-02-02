import { AbstractInputProcessor } from './AbstractInputProcessor';
import { CommonInputModel } from '../models/CommonInputModel';
import { CommonModel } from '../models/CommonModel'
import { simplify } from '../simplification/Simplify';
import { Schema } from '../models/Schema';
/**
 * Class for processing JSON Schema
 */
export class JsonSchemaInputProcessor extends AbstractInputProcessor {
    
    /**
     * Function for processing a JSON Schema input.
     * 
     * @param object 
     */
    async process(object: any): Promise<CommonInputModel> {
        if(object.$schema !== undefined){
            switch(object.$schema){
                case 'http://json-schema.org/draft-07/schema#':
                    const schema = Schema.toSchema(object);
                    const commonInputModel = new CommonInputModel();
                    commonInputModel.originalInput = schema;
                    commonInputModel.models = JsonSchemaInputProcessor.convertSchemaToCommonModel(object);
                    return commonInputModel;
            }
        }
        throw "Input not supported"
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
            }else{
                console.log("Looks like someone is missing an id");
            }
        });
        return commonModelsMap;
    }
}
