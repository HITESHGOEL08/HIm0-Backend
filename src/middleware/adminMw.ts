import { NextFunction, Request, Response } from "express";

import HttpStatusCodes from "../common/HttpStatusCodes";

import { decordJWT } from "../util/handlingJWT";

const USER_UNAUTHORIZED_ERR = "User not authorized to perform this action";

async function adminMw(req: Request, res: Response, next: NextFunction) {
  const { headers } = req;

  if (!headers.authorization?.split(" ")[1]) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: USER_UNAUTHORIZED_ERR });
  }

  const jwtValue = await decordJWT(headers.authorization.split(" ")[1]);

  next();
}

// **** Export Default **** //
export default adminMw;
