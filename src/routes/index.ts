import adminApiRouter from "@src/modules/adminModule/routes/adminRoutes";
import Paths from "@src/common/Paths";
import userApiRouter from "@src/modules/userModule/routes/userRoutes";
import { Router } from "express";
import authApiRouter from "@src/modules/authModule/routes";
import notificationApiRouter from "@src/modules/notificationModule/routes";
import messageingApiRouter from "@src/modules/messagingModule/routes";
import dashboardApiRouter from "@src/modules/dashboadModule/routes";
import bettingApiRouter from "@src/modules/bettingModule/routes";
import adminMw from "@src/middleware/adminMw";
import globalApiRouter from "./globalRoutes";

const apiRouter = Router();

apiRouter.use(Paths.Auth.Base, authApiRouter);
apiRouter.use(Paths.Admin.Base, adminApiRouter);
apiRouter.use(Paths.Users.Base, adminMw, userApiRouter);
apiRouter.use(Paths.Notification.Base, notificationApiRouter);
apiRouter.use(Paths.Messaging.Base, adminMw, messageingApiRouter);
apiRouter.use(Paths.Dashboard.Base, adminMw, dashboardApiRouter);
apiRouter.use(Paths.Bets.Base, adminMw, bettingApiRouter);
apiRouter.use(globalApiRouter);

// **** Export default **** //

export default apiRouter;
