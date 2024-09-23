import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import logger from "jet-logger";
import "express-async-errors";
import BaseRouter from "@src/routes";
import Paths from "@src/common/Paths";
import EnvVars from "@src/common/EnvVars";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { NodeEnvs } from "@src/common/misc";
import { RouteError } from "@src/common/classes";
import cors from "cors";
import Logging from "@src/util/logging";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger";
import { rateLimit } from "express-rate-limit";
import { slowDown } from "express-slow-down";
import timeout from "connect-timeout";
import { timeoutMw } from "./routes/middleware/timeoutMw";

const app = express();
const corsOptions = {
  origin: "*", // Replace with your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
// Expose lodash globally

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,// 5 minutes
  limit: 50, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
  standardHeaders: false, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
});

const slowDownLimiter = slowDown({
  windowMs: 1 * 60 * 1000, // 5 minutes
  delayAfter: 50, // allow 10 requests per `windowMs` (5 minutes) without slowing them down
  delayMs: (hits) => hits * 300, // add 200 ms of delay to every request after the 10th
  maxDelayMs: 5000, // max global delay of 5 seconds
});

app.use(limiter);
app.use(slowDownLimiter);
app.use(timeoutMw(EnvVars.globalTimeout));

// Basic middleware
app.use(express.json());
app.use(Logging.requestLogger);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

mongoose
  .connect(EnvVars.mongoDBURL, { dbName: "raha" })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan("dev"));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}
app.get(Paths.Health, (req, res) => {
  res.status(200).send({ status: "UP" });
});

app.use(Paths.Base, BaseRouter);

app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  }
);

export default app;