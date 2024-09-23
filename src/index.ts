import "./pre-start";

import EnvVars from "./common/EnvVars";
import server from "./server";
import { logger } from "./util/logging";

const SERVER_START_MSG =
  "Express server started on port: " + EnvVars.Port.toString();

server.listen(EnvVars.Port, () => {
  logger.info(SERVER_START_MSG);
});
