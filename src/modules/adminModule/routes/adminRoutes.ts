import Paths from "@src/common/Paths";
import { Router } from "express";
import adminMw from "@src/middleware/adminMw";
import MetaDataController from "@src/modules/adminModule/controllers/metaDataController";
import AuthController from "@src/modules/authModule/controllers/authController";
import UserController from "../controllers/userController";
import langController from "../controllers/langController";

const adminApiRouter = Router();
const adminAuthRouter = Router();
const adminUserRouter = Router();
const adminLangRouter = Router();
const adminMetaRouter = Router();

// Admin Users Routes
adminUserRouter.post(
  Paths.Admin.User.GetAllUsers,
  //  adminMw,
  UserController.getAllUsers
);
adminUserRouter.post(
  Paths.Admin.User.GetUser,
  //  adminMw,
  UserController.getUserInfo
);
adminUserRouter.post(
  Paths.Admin.User.UpdateUserInfo,
  //  adminMw,
  UserController.updateUserInfo
);
adminUserRouter.post(
  Paths.Admin.User.UpdateUserInfo,
  //  adminMw,
  UserController.updateUserInfo
);

adminUserRouter.post(
  Paths.Admin.User.CreateUser,
  //  adminMw,
  UserController.createAdminUsers
);

adminApiRouter.use(Paths.Admin.User.Base, adminUserRouter);

// Admin Lang Routes

adminLangRouter.post(
  Paths.Admin.Lang.CreateLang,
  //  adminMw,
  langController.createLangInfo
);
adminLangRouter.post(
  Paths.Admin.Lang.GetAllLang,
  //  adminMw,
  langController.getAllLang
);
adminLangRouter.post(
  Paths.Admin.Lang.UpdateLang,
  //  adminMw,
  langController.updateLangInfo
);

adminApiRouter.use(Paths.Admin.Lang.Base, adminLangRouter);

// Admin Meta Routes

adminMetaRouter.post(
  Paths.MetaData.AddAllMetaData,
  //  adminMw,
  MetaDataController.initializeMetadata
);
adminMetaRouter.post(
  Paths.MetaData.GetMetadata,
  MetaDataController.getMetadata
);
adminMetaRouter.post(
  Paths.MetaData.AddMetaData,
  // adminMw,
  MetaDataController.addMetaData
);

adminApiRouter.use(Paths.MetaData.Base, adminMetaRouter);

// Admin Auth Routes
adminAuthRouter.post(Paths.Auth.Login, AuthController.login);
adminAuthRouter.post(Paths.Auth.Logout, adminMw, AuthController.logout);
adminAuthRouter.post(
  Paths.Auth.DeletedUser,
  adminMw,
  AuthController.deleteUser
);

adminApiRouter.use(Paths.Auth.Base, adminAuthRouter);

// **** Export default **** //

export default adminApiRouter;
