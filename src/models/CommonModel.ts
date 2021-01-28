import { CommonSchema } from "./CommonSchema";
import { Schema } from "./Schema";

/**
 * Common representation for the renderers.
 * 
 * @extends CommonSchema<CommonModel>
 */
export class CommonModel extends CommonSchema<CommonModel>{
    extend?: string
    originalSchema?: Schema

    /**
     * Transform object into a type of CommonModel.
     * 
     * @param object to transform
     * @returns CommonModel instance of the object
     */
    static toCommonModel(object: Object) : CommonModel{
        let newCommonModel = new CommonModel();
        newCommonModel = Object.assign(newCommonModel, object);
        newCommonModel = CommonSchema.transformSchema(newCommonModel, object, CommonModel.toCommonModel);
        if(newCommonModel.originalSchema !== undefined){
            newCommonModel.originalSchema = Schema.toSchema(newCommonModel.originalSchema);
        }
        return newCommonModel;
    }
}