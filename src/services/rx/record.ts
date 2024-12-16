import { RxModule } from "../../types/rx-module";
import i18n from '../../config/i18n.json';
import { createOrGetModel } from "../../rx-utils/schema";
import { RestResponse } from "../../types/rest-res";
import RxModuleModel from "../../models/rxModule.model";
import { RestBadReqJson } from "../../config/rest";

export const insertRxRecord = async (data: RxModule): Promise<RestResponse> => {
    try {
        const documentData: any = {};
        const dynamicModel = createOrGetModel(data);

        data.fields.forEach((field: any) => {
            documentData[field.name] = field.value || null;
        });

        const res = await dynamicModel.create(documentData);

        return {
            message: i18n.rx.record.INSERTED,
            status: "success",
            data: {
                res: res
            }
        }

    } catch (error: any) {
        return {
            message: error?.message,
            status: "error"
        }
    }
}


export const getRxRecordsForLookupField = async (moduleId: string, fieldId: string, page: number): Promise<RestResponse> => {
    try {
        const moduleJSON = await RxModuleModel.findById(moduleId).lean();

        if (!moduleJSON?.name) {
            return RestBadReqJson(i18n.rx.record.INVALID_MODULE);
        }

        let onlyFieldToSelect: string = "";
        if (fieldId) {
            onlyFieldToSelect = moduleJSON.fields.find((item) => item._id.toString() === fieldId)?.name.toString() ?? "";
        }

        const dynamicModel = createOrGetModel(moduleJSON);
        const chainCall = dynamicModel.find({});
        if (onlyFieldToSelect) chainCall.select(onlyFieldToSelect);
        const recordData = await chainCall.lean();

        const jsonMapped = recordData.map((item) => {
            return {
                _id: item._id,
                [fieldId]: item[onlyFieldToSelect]
            }
        })

        return {
            message: i18n.rx.record.FETCHED_RECORDS,
            status: "success",
            data: {
                records: jsonMapped
            }
        }
    } catch (error: any) {
        return {
            message: error?.message,
            status: "error"
        }
    }
}

export const getRxRecordsForListing = async (moduleName: string, perPage: number, page: number): Promise<RestResponse> => {
    try {
        const moduleJSON = await RxModuleModel.findOne({
            name: moduleName
        }).lean();

        if (!moduleJSON?.name) {
            return RestBadReqJson(i18n.rx.record.INVALID_MODULE);
        }

        const dynamicModel = createOrGetModel(moduleJSON);
        const totalRecords = await dynamicModel.countDocuments();


        // create pagination array by limit 
        let pagination = [];
        if(totalRecords > perPage){
            for (let i = 1; i <= totalRecords / perPage; i++) {
                pagination.push(i);
            }
            if (totalRecords % perPage > 0) {
                pagination.push(pagination[pagination.length - 1] + 1);
            }
        }else{
            pagination.push(1)
        }

        //toskip records
        const toSkip = (page-1)*perPage;

        const chainCall = await dynamicModel.find({}).skip(toSkip).limit(perPage).lean();

        return {
            message: i18n.rx.record.FETCHED_RECORDS,
            status: "success",
            data: {
                records: chainCall,
                pagination: pagination,
                page: page
            }
        }
    } catch (error: any) {
        return {
            message: error?.message,
            status: "error"
        }
    }
}