import Paths from "@src/common/Paths";
import MetaDataController from "@src/modules/adminModule/controllers/metaDataController";

import { Router } from "express";

const globalApiRouter = Router();

const metaRouter = Router();

metaRouter.post(Paths.MetaData.GetMetadata, MetaDataController.getMetadata);

globalApiRouter.use(Paths.MetaData.Base, metaRouter);

// **** Export default **** //
export default globalApiRouter;
