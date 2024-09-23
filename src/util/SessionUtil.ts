import HttpStatusCodes from "../common/HttpStatusCodes";
import { RouteError } from "../common/classes";
import EnvVars from "../common/EnvVars";
import { IReq, IRes } from "../common/types";
import { decordJWT, Errors, generateJWT } from "./handlingJWT";

/**
 * Get session data from request object (i.e. ISessionUser)
 */
function getSessionData<T>(req: IReq): Promise<string | T | undefined> {
  const { Key } = EnvVars.CookieProps,
    jwt = req.signedCookies[Key];
  return decordJWT(jwt);
}

/**
 * Add a JWT to the response
 */
async function addSessionData(res: IRes, data: string | object): Promise<IRes> {
  if (!res || !data) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, Errors.ParamFalsey);
  }
  // Setup JWT
  const jwt = await generateJWT(data, "Access"),
    { Key, Options } = EnvVars.CookieProps;
  // Return
  return res.cookie(Key, jwt, Options);
}

/**
 * Remove cookie
 */
function clearCookie(res: IRes): IRes {
  const { Key, Options } = EnvVars.CookieProps;
  return res.clearCookie(Key, Options);
}

// **** Export default **** //

export default {
  addSessionData,
  getSessionData,
  clearCookie,
} as const;
