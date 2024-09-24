import Paths from "@src/common/Paths";
import { Router } from "express";
import adminMw from "@src/middleware/adminMw";
import MetaDataController from "@src/modules/adminModule/controllers/metaDataController";

const adminApiRouter = Router();


const metaRouter = Router();

metaRouter.post(
  Paths.MetaData.AddAllMetaData,
  MetaDataController.initializeMetadata
);
metaRouter.post(
  Paths.MetaData.GetMetadata,
  MetaDataController.getMetadata
);

// adminApiRouter.use(Paths.MetaData.Base, adminMw, metaRouter);
adminApiRouter.use(Paths.MetaData.Base, metaRouter);



// **** Export default **** //

export default adminApiRouter;
