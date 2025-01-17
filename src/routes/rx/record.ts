import { Router } from "express";
import { getRxRecordAsModuleByModuleNameAndRecordId, getRxRecordsForListing, getRxRecordsForLookupField, insertRxRecord } from "../../services/rx/record";
import { RxModule } from "../../types/rx-module";
import { RestErrorJson } from "../../config/rest";

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

// get list of record for the given lookup field id
router.get("/lookup/:moduleId/:fieldId", async (req, res) => {
    try {
        const { moduleId, fieldId } = req.params;
        const { page } = req.query;

        const record = await getRxRecordsForLookupField(moduleId, fieldId, Number(page));
        res.json(record);
        return;
    } catch (error) {
        res.status(500).json(RestErrorJson(error));
        return;
    }
});

// get the list of records by moduleName
// for different views like listing  etc. 
router.get("/list/:moduleName", async (req, res) => {
    try {
        const { moduleName } = req.params;
        let { perPage, page } = req.query;

        if (!perPage || isNaN(Number(perPage))) {
            perPage = String(10);
        }
        if (!page || isNaN(Number(page))) {
            page = String(10)
        }

        const record = await getRxRecordsForListing(moduleName, Number(perPage), Number(page));
        res.json(record);
        return;
    } catch (error) {
        res.status(500).json(RestErrorJson(error));
        return;
    }
});

// for different views like listing, record details etc. 
router.get("/:moduleName/:recordId", async (req, res) => {
    try {
        const { moduleName, recordId } = req.params;

        const record = await getRxRecordAsModuleByModuleNameAndRecordId(moduleName, recordId);
        res.json(record);
        return;
    } catch (error) {
        res.status(500).json(RestErrorJson(error));
        return;
    }
});

export default router;