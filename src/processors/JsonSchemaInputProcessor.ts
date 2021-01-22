import { CommonInputModel } from '../models/CommonInputModel';
import { I_InputProcessor } from '../interfaces/I_InputProcessor';
import { CommonModel } from '../models/CommonModel';
export class JsonSchemaInputProcessor implements I_InputProcessor {
    async process(object: any): Promise<CommonInputModel> {
        const commonInputModel = new CommonInputModel();
        commonInputModel.originalSchema = object;
        commonInputModel.models = JsonSchemaInputProcessor.convertSchemaToCommonModel(object);
        return commonInputModel;
    }

    /**
     * Simplifies a JSON Schema into a common models
     * 
     * @param schema to simplify to common model
     */
    static convertSchemaToCommonModel(schema: any) : CommonModel[]{
        //To be defined in https://github.com/asyncapi/shape-up-process/issues/53
        throw new Error('Method not implemented.');
    }
    
}
