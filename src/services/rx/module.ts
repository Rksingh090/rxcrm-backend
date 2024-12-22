import { Document, ObjectId } from "mongodb";
import { rxConfig } from "../../config/config";
import i18n from "../../config/i18n.json";
import { DbFindAll, DbFindOne, DbInsertDocument } from "../../db/mongo/crud";
import { RestResponse } from "../../types/rest-res";
import { RxModule } from "../../types/rx-module";

export const createNewRxModule = async (data: RxModule): Promise<RestResponse> => {
    try {
        const newModule = await DbInsertDocument(rxConfig.DB.static_module, data);

        return {
            message: i18n.rx.module.CREATED,
            status: "success",
            data: {
                module: {
                    ...data,
                    _id: newModule.insertedId
                }
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
        const pipeline: Document[] = [];
        pipeline.push({
            $project: {
                name: 1,
                displayName: 1
            }
        });

        const modulesList = await DbFindAll(rxConfig.DB.static_module, pipeline);

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

        const rxModule = await DbFindOne(rxConfig.DB.static_module, { name });

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

        const rxModule = await DbFindOne(rxConfig.DB.static_module, { _id: new ObjectId(id) });


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
