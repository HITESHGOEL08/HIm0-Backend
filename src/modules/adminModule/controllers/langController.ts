import { NextFunction, Request, Response } from "express";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { logFunctionName, logger } from "@src/util/logging";
import check from "@src/common/check";
import { sendResponseObject } from "@src/util/misc";

const getAllLang = async (req: Request, res: Response, next: NextFunction) => {
  logFunctionName(getAllLang, "reqBody--> ", req.body);
  try {
  } catch (error) {
    logFunctionName(getAllLang, "error --->  ", error);

    const response = sendResponseObject(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Error Happened"
    );
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
};

const createLangInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logFunctionName(createLangInfo, "reqBody--> ", req.body);
  try {
  } catch (error) {
    logFunctionName(createLangInfo, "error --->  ", error);

    const response = sendResponseObject(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Error Happened"
    );
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
};

const updateLangInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logFunctionName(updateLangInfo, "reqBody--> ", req.body);
  try {
  } catch (error) {
    logFunctionName(updateLangInfo, "error --->  ", error);

    const response = sendResponseObject(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Error Happened"
    );
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
};

export default {
  getAllLang,
  createLangInfo,
  updateLangInfo,
} as const;
