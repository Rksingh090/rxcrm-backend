import { Router } from "express";
import { insertRxRecord } from "../../services/rx/record";
import { RxModule } from "../../types/rx-module";
import mongoose from "mongoose";
import RxModuleModel from "../../models/rxModule.model";
import { RestBadReqJson, RestErrorJson } from "../../config/rest";
import i18n from "../../config/i18n.json";
import { createOrGetModel } from "../../rx-utils/schema";

const router = Router();

router.post("/create", async (req, res) => {
    try {
        const data: RxModule = req.body;

        const insRes = await insertRxRecord(data);
        res.json(insRes);
        return;

    } catch (error) {
        res.status(500).json(RestErrorJson(error));
        return;
    }
});

router.get("/lookup/:moduleId/:fieldId", async (req, res) => {
    try {
        const { moduleId, fieldId } = req.params;
        const { page } = req.query;

        const moduleJSON = await RxModuleModel.findById(moduleId).lean();

        if (!moduleJSON?.name) {
            res.status(400).json(RestBadReqJson(i18n.rx.record.INVALID_MODULE))
            return
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

        res.json({
            message: i18n.rx.record.FETCHED_RECORDS,
            status: "success",
            data: {
                records: jsonMapped
            }
        });
        return;
    } catch (error) {
        res.status(500).json(RestErrorJson(error));
        return;
    }
});

export default router;