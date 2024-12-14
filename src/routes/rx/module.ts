import { Router } from "express";
import { createNewRxModule, getAllRxModulesList, getRxModuleById, getRxModuleByName } from "../../services/rx/module";
import { RestErrorJson } from "../../config/rest";
import { RxModule } from "../../types/rx-module";

const router = Router();


router.post("/create", async (req, res) => {
    try {
        const data: RxModule = req.body;
        const moduleJSON = await createNewRxModule(data);
        res.json(moduleJSON);
        return;
    }
    catch (ex) {
        res.status(500).json(RestErrorJson(ex));
        return;
    }
});

router.get("/", async (req, res) => {
    try {
        const modulesList = await getAllRxModulesList();
        res.json(modulesList);
        return;
    }
    catch (ex) {
        res.status(500).json(RestErrorJson(ex));
        return;
    }
});
router.get("/:name", async (req, res) => {
    try {
        const {name} = req.params;
        const rxModule = await getRxModuleByName(name);
        res.json(rxModule);
        return;
    }
    catch (ex) {
        res.status(500).json(RestErrorJson(ex));
        return;
    }
});

router.get("/id/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const rxModule = await getRxModuleById(id);
        res.json(rxModule);
        return;
    }
    catch (ex) {
        res.status(500).json(RestErrorJson(ex));
        return;
    }
});


export default router;
