import { logger } from "@src/util/logging";
import HttpStatusCodes from "../common/HttpStatusCodes";
import { Request, Response, NextFunction } from "express";

export const timeoutMw = (timeoutDuration: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setTimeout(timeoutDuration, () => {
      logger.info(
        `Request has timed out after ${timeoutDuration / 1000} seconds.`
      );
      res
        .status(HttpStatusCodes.GATEWAY_TIMEOUT)
        .send("Service unavailable. Please try again later.");
    });
    next();
  };
};
