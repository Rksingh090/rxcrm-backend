import { RxInputField, RxModule } from "../../types/rx-module";
import i18n from '../../config/i18n.json';
import { createOrGetModel } from "../../rx-utils/schema";
import { RestResponse } from "../../types/rest-res";
import { RestBadReqJson } from "../../config/rest";
import { DbFindById, DbFindOne } from "../../db/mongo/crud";
import { rxConfig } from "../../config/config";
import { ObjectId } from "mongodb";

export const insertRxRecord = async (data: RxModule): Promise<RestResponse> => {
    try {
        const documentData: any = {};
        const dynamicModel = await createOrGetModel(data);

        data.fields.forEach((field: any) => {
            documentData[field.name] = field.value || null;
        });

        // const res = await dynamicModel.create(documentData);

        const createRec = await dynamicModel.insertOne(documentData);

        return {
            message: i18n.rx.record.INSERTED,
            status: "success",
            data: {
                res: createRec
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
        // const moduleJSON = await RxModuleModel.findById(moduleId).lean();
        const moduleJSON = await DbFindById(rxConfig.DB.static_module, moduleId) as RxModule;
        const dynamicModel = await createOrGetModel(moduleJSON);

        if (!moduleJSON?.name) {
            return RestBadReqJson(i18n.rx.record.INVALID_MODULE);
        }

        let onlyFieldToSelect: string = "";
        if (fieldId) {
            onlyFieldToSelect = moduleJSON.fields.find((item) => item._id.toString() === fieldId)?.name.toString() ?? "";
        }

        const chainCall = dynamicModel.find({});
        const recordData = await chainCall.toArray();

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
        const moduleJSON = await DbFindOne(rxConfig.DB.static_module, { name: moduleName }) as RxModule;

        if (!moduleJSON?.name) {
            return RestBadReqJson(i18n.rx.record.INVALID_MODULE);
        }

        const dynamicModel = await createOrGetModel(moduleJSON);
        const totalRecords = await dynamicModel.countDocuments();


        // create pagination array by limit 
        let pagination = [];
        if (totalRecords > perPage) {
            for (let i = 1; i <= totalRecords / perPage; i++) {
                pagination.push(i);
            }
            if (totalRecords % perPage > 0) {
                pagination.push(pagination[pagination.length - 1] + 1);
            }
        } else {
            pagination.push(1)
        }

        //toskip records
        const toSkip = (page - 1) * perPage;

        const chainCall = await dynamicModel.find({}).skip(toSkip).limit(perPage).toArray();

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

export const getRxRecordByModuleIdAndRecordId = async (moduleId: string, recordId: string, fieldId: string): Promise<RestResponse> => {
    try {
        const moduleJSON = await DbFindOne(rxConfig.DB.static_module, { _id: new ObjectId(moduleId) }) as RxModule;
        if (!moduleJSON?.name) {
            return RestBadReqJson(i18n.rx.record.INVALID_MODULE);
        }
        const fieldToReturn = moduleJSON.fields.find((item) => String(item._id) === String(fieldId));

        const dynamicModel = await createOrGetModel(moduleJSON);

        const chainCall = await dynamicModel.findOne({
            _id: new ObjectId(recordId)
        });

        if(!chainCall){
            return {
                message: i18n.rx.record.RECORD_NOT_FOUND,
                status: "error",
                data: {
                }
            }
        }

        return {
            message: i18n.rx.record.FETCHED_RECORDS,
            status: "success",
            data: {
                fieldValue: chainCall[fieldToReturn?.name ?? ""],
            }
        }

    } catch (error: any) {
        return {
            message: error?.message,
            status: "error"
        }
    }
}

export const getRxRecordAsModuleByModuleNameAndRecordId = async (moduleName: string, recordId: string): Promise<RestResponse> => {
    try {
        const moduleJSON = await DbFindOne(rxConfig.DB.static_module, { name: moduleName }) as RxModule;

        if (!moduleJSON?.name) {
            return RestBadReqJson(i18n.rx.record.INVALID_MODULE);
        }

        const dynamicModel = await createOrGetModel(moduleJSON);

        const chainCall = await dynamicModel.findOne({
            _id: new ObjectId(recordId)
        });

        if (chainCall === null) {
            return {
                message: i18n.rx.record.RECORD_NOT_FOUND,
                status: "error",
                data: {
                    record: chainCall,
                }
            }
        }

        const recordAsModuleJSON: RxModule = {
            ...moduleJSON,
            fields: moduleJSON.fields.map((item) => {
                item.value = chainCall[item.name];
                return item;
            })
        };

        let newFields: RxInputField[] = [];

        // replace the value with actual field for lookup
        for (let i = 0; i < recordAsModuleJSON.fields.length; i++) {
            let field = recordAsModuleJSON.fields[i];
            if (field.dataType === 'lookup') {
                const data = await getRxRecordByModuleIdAndRecordId(field.lookup?.lookup_module_id ?? "", field?.value ?? "", field.lookup?.lookup_field_id ?? "");
                if(data.status === "success"){
                    field.value = data.data.fieldValue;
                }
            } 
            newFields.push(field);
        }

        recordAsModuleJSON.fields = newFields;

        return {
            message: i18n.rx.record.FETCHED_RECORDS,
            status: "success",
            data: {
                record: recordAsModuleJSON,
            }
        }
    } catch (error: any) {
        return {
            message: error?.message,
            status: "error"
        }
    }
}