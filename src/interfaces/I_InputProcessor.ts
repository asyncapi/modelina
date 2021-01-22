import { CommonInputModel } from "models/CommonInputModel";

export interface I_InputProcessor {
    //Process string content
    process(object: any) : Promise<CommonInputModel>
}