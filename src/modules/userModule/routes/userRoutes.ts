import { Router } from "express";

import Paths from "@src/common/Paths";
import adminMw from "@src/middleware/adminMw";

// **** Variables **** //

const userApiRouter = Router();

// **** UserRouter **** //
const userRouter = Router();

// User Routes
// userRouter.post(Paths.Users.Get, UserController.getAll);
// userRouter.post(Paths.Users.Add, UserController.add);
// userRouter.put(Paths.Users.Update, UserController.update);
// userRouter.post(Paths.Users.Delete, UserController.delete);

// Add UserRouter
userApiRouter.use(userRouter);

// **** Export default **** //

export default userApiRouter;
