import { NextFunction, Request, Response } from "express";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { logFunctionName, logger } from "@src/util/logging";
import check from "@src/common/check";
import { sendResponseObject } from "@src/util/misc";
import { Users } from "@src/modules/authModule/models/UserData";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  logFunctionName(getAllUsers, "reqBody--> ", req.body);
  const [offset, limit] = check.isNum(req.body, ["offset", "limit"]);
  const { filters } = req.body;

  try {
    const query: any = {};

    if (filters) {
      if (filters.name) {
        query.name = { $regex: filters.name, $options: "i" }; // Case-insensitive search
      }
      if (filters.email) {
        query.email = { $regex: filters.email, $options: "i" }; // Case-insensitive search
      }
    }

    const [result] = await Users.aggregate([
      { $match: query },
      {
        $facet: {
          users: [{ $skip: offset }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    return {
      users: result.users,
      totalCount: result.totalCount.length > 0 ? result.totalCount[0].count : 0,
    };
  } catch (error) {
    logFunctionName(getAllUsers, "error --->  ", error);

    const response = sendResponseObject(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Error Happened"
    );
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
};

const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  logFunctionName(getUserInfo, "reqBody--> ", req.body);
  try {
  } catch (error) {
    logFunctionName(getUserInfo, "error --->  ", error);

    const response = sendResponseObject(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Error Happened"
    );
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
};

const updateUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logFunctionName(updateUserInfo, "reqBody--> ", req.body);
  try {
  } catch (error) {
    logFunctionName(updateUserInfo, "error --->  ", error);

    const response = sendResponseObject(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Error Happened"
    );
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
};
const createAdminUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logFunctionName(createAdminUsers, "reqBody--> ", req.body);
  try {
  } catch (error) {
    logFunctionName(createAdminUsers, "error --->  ", error);

    const response = sendResponseObject(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Error Happened"
    );
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
};

export default {
  getAllUsers,
  getUserInfo,
  updateUserInfo,
  createAdminUsers,
} as const;
