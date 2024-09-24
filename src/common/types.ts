import { ISessionUser } from "@src/modules/userModule/models/User";
import { Response, Request } from "express";


type TObj = Record<string, unknown>;

export interface IReq extends Request<TObj, void, TObj, TObj> {
  signedCookies: Record<string, string>;
}

interface ILocals {
  sessionUser: ISessionUser;
}

export type IRes = Response<unknown, ILocals>;
