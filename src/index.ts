import "./pre-start";
import logger from "jet-logger";

import EnvVars from "@src/common/EnvVars";
import server from "./server";

const SERVER_START_MSG =
  "Express server started on port: " + EnvVars.Port.toString();

server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));