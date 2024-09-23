import { Router } from "express";

import Paths from "@src/common/Paths";

import adminMw from "./middleware/adminMw";
import AuthController from "../controllers/authController";
import UserController from "../controllers/userController";
import BetController from "../controllers/betController";

// **** Variables **** //

const apiRouter = Router();

// **** AuthRouter **** //

const authRouter = Router();

// Routes
authRouter.post(Paths.Auth.CheckUser, AuthController.checkuser);
authRouter.post(Paths.Auth.CreateUser, AuthController.createUser);
authRouter.post(Paths.Auth.Login, AuthController.login);
authRouter.post(Paths.Auth.Logout, AuthController.logout);
authRouter.post(Paths.Auth.DeletedUser, AuthController.deleteUser);

// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);

// **** UserRouter **** //
const userRouter = Router();

// User Routes
userRouter.post(Paths.Users.Get, UserController.getAll);
userRouter.post(Paths.Users.Add, UserController.add);
userRouter.put(Paths.Users.Update, UserController.update);
userRouter.post(Paths.Users.Delete, UserController.delete);

// Add UserRouter
apiRouter.use(Paths.Users.Base, adminMw, userRouter);

const betRouter = Router();

// User Routes
betRouter.post(Paths.Bets.placeBet, BetController.placeBet);
betRouter.post(Paths.Bets.getAllBets, BetController.getBets);
betRouter.post(Paths.Bets.getBet, BetController.getBet);

// Add UserRouter
apiRouter.use(Paths.Users.Base, adminMw, betRouter);

// **** Export default **** //

export default apiRouter;
