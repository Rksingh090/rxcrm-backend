import i18n from '../config/i18n.json';
import { RestResponse } from '../types/rest-res';

export const RestBadReqJson = (message: any): RestResponse => {
    return {
        message: message,
        status: "error"
    }
}
export const RestErrorJson = (error: any): RestResponse => {
    return {
        message: error?.message ?? i18n.rest.error.unknown,
        status: "error"
    }
}