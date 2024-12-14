import { RxModule } from "../../types/rx-module";
import i18n from '../../config/i18n.json';
import { createOrGetModel } from "../../rx-utils/schema";
import { RestResponse } from "../../types/rest-res";

export const insertRxRecord = async (data: RxModule) : Promise<RestResponse> => {
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