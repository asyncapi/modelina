import { CommonModel } from './CommonModel';
export class CommonInputModel {
    models: Map<string, CommonModel> = new Map();
    customizations: Object = {};
    originalInput: any = {};
}