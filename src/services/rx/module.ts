import i18n from "../../config/i18n.json";
import RXFormFieldModel from "../../models/rxModule.model";
import { RestResponse } from "../../types/rest-res";
import { RxModule } from "../../types/rx-module";

export const createNewRxModule = async (data: RxModule): Promise<RestResponse> => {
    try {

        const newModule = await RXFormFieldModel.create(data);
        const moduleData = await newModule.save();

        return {
            message: i18n.rx.module.CREATED,
            status: "success",
            data: {
                module: moduleData
            }
        }
    } catch (error: any) {
        return {
            message: error?.message,
            status: "error"
        }
    }
}
export const getAllRxModulesList = async (): Promise<RestResponse> => {
    try {

        const modulesList = await RXFormFieldModel.find({}).select("name displayName").lean();

        return {
            message: i18n.rx.module.ALL_LIST,
            status: "success",
            data: {
                modules: modulesList
            }
        }
    } catch (error: any) {
        return {
            message: error?.message,
            status: "error"
        }
    }
}
export const getRxModuleByName = async (name: string): Promise<RestResponse> => {
    try {

        const rxModule = await RXFormFieldModel.findOne({
            name: name
        })
            .lean();

        return {
            message: i18n.rx.module.MODULE_FETCH,
            status: "success",
            data: {
                module: rxModule
            }
        }
    } catch (error: any) {
        return {
            message: error?.message,
            status: "error"
        }
    }
} 
export const getRxModuleById = async (id: string): Promise<RestResponse> => {
    try {

        const rxModule = await RXFormFieldModel.findById(id)
            .lean();

        return {
            message: i18n.rx.module.MODULE_FETCH,
            status: "success",
            data: {
                module: rxModule
            }
        }
    } catch (error: any) {
        return {
            message: error?.message,
            status: "error"
        }
    }
} 
