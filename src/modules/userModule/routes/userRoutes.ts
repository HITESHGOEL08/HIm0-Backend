import { Router } from "express";

import AuthController from "@src/modules/userModule/controllers/authController";
import BetController from "@src/modules/userModule/controllers/betController";
import MetaDataController from "@src/modules/adminModule/controllers/metaDataController";
import Paths from "@src/common/Paths";
import adminMw from "@src/middleware/adminMw";

// **** Variables **** //

const userApiRouter = Router();

// **** AuthRouter **** //

const authRouter = Router();

// Routes
authRouter.post(Paths.Auth.CheckUser, AuthController.checkuser);
authRouter.post(Paths.Auth.CreateUser, AuthController.createUser);
authRouter.post(Paths.Auth.Login, AuthController.login);
authRouter.post(Paths.Auth.Logout, AuthController.logout);
authRouter.post(Paths.Auth.DeletedUser, AuthController.deleteUser);

// Add AuthRouter
userApiRouter.use(Paths.Auth.Base, authRouter);

// **** UserRouter **** //
const userRouter = Router();

// User Routes
// userRouter.post(Paths.Users.Get, UserController.getAll);
// userRouter.post(Paths.Users.Add, UserController.add);
// userRouter.put(Paths.Users.Update, UserController.update);
// userRouter.post(Paths.Users.Delete, UserController.delete);

// Add UserRouter
userApiRouter.use(Paths.Users.Base, adminMw, userRouter);

const betRouter = Router();

// User Routes
betRouter.post(Paths.Bets.placeBet, BetController.placeBet);
betRouter.post(Paths.Bets.getAllBets, BetController.getBets);
betRouter.post(Paths.Bets.getBet, BetController.getBet);

// Add UserRouter
userApiRouter.use(Paths.Users.Base, adminMw, betRouter);

const metaRouter = Router();

metaRouter.post(Paths.MetaData.GetMetadata, MetaDataController.getMetadata);

userApiRouter.use(Paths.MetaData.Base, metaRouter);

// **** Export default **** //

export default userApiRouter;
