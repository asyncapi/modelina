import { CommonInputModel } from '../models/CommonInputModel';
import { AbstractInputProcessor } from '../models/AbstractInputProcessor';
import { CommonModel } from '../models/CommonModel';
import { simplify } from '../simplification/Simplify';
import { Schema } from '../models/Schema';
export class JsonSchemaInputProcessor extends AbstractInputProcessor {
    /**
     * Function for processing a JSON Schema input.
     * 
     * @param object 
     */
    async process(object: any): Promise<CommonInputModel> {
        const commonInputModel = new CommonInputModel();
        commonInputModel.originalInput = object;
        commonInputModel.models = JsonSchemaInputProcessor.convertSchemaToCommonModel(object);
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
            }else{
                console.log("Looks like someone is missing an id");
            }
        });
        return commonModelsMap;
    }
    
}
