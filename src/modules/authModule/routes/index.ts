import Paths from "@src/common/Paths";
import AuthController from "@src/modules/authModule/controllers/authController";

import { Router } from "express";

const authApiRouter = Router();

authApiRouter.post(Paths.Auth.CheckUser, AuthController.checkuser);
authApiRouter.post(Paths.Auth.CreateUser, AuthController.createUser);
authApiRouter.post(Paths.Auth.Login, AuthController.login);
authApiRouter.post(Paths.Auth.Logout, AuthController.logout);
authApiRouter.post(Paths.Auth.DeletedUser, AuthController.deleteUser);

// **** Export default **** //

export default authApiRouter;
