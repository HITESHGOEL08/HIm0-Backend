import adminApiRouter from "@src/modules/adminModule/routes/adminRoutes";
import Paths from "@src/common/Paths";
import userApiRouter from "@src/modules/userModule/routes/userRoutes";
import { Router } from "express";

const apiRouter = Router();

apiRouter.use(Paths.Admin.Base, adminApiRouter);
apiRouter.use(userApiRouter);

// **** Export default **** //

export default apiRouter;
