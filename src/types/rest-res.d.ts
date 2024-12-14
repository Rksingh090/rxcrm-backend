
export type RestResponseStatus = "success" | "error";

export interface RestResponse {
    status: RestResponseStatus,
    message: string,
    data?: any
}