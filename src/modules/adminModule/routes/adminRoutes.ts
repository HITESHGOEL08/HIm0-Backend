import Paths from "@src/common/Paths";
import { Router } from "express";
import adminMw from "@src/middleware/adminMw";
import MetaDataController from "@src/modules/adminModule/controllers/metaDataController";
import AuthController from "@src/modules/authModule/controllers/authController";

const adminApiRouter = Router();

const metaRouter = Router();

metaRouter.post(
  Paths.MetaData.AddAllMetaData,
  //  adminMw,
  MetaDataController.initializeMetadata
);
metaRouter.post(Paths.MetaData.GetMetadata, MetaDataController.getMetadata);
metaRouter.post(
  Paths.MetaData.AddMetaData,
  // adminMw,
  MetaDataController.addMetaData
);

adminApiRouter.use(Paths.MetaData.Base, metaRouter);

const authRouter = Router();

authRouter.post(Paths.Auth.Login, AuthController.login);
authRouter.post(Paths.Auth.Logout, adminMw, AuthController.logout);
authRouter.post(Paths.Auth.DeletedUser, adminMw, AuthController.deleteUser);

adminApiRouter.use(Paths.Auth.Base, authRouter);

// **** Export default **** //

export default adminApiRouter;
