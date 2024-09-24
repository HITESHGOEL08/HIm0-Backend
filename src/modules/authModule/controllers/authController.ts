import check from "@src/common/check";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { IReq, IRes } from "@src/common/types";
import { generateJWT } from "@src/util/handlingJWT";
import { logFunctionName } from "@src/util/logging";
import { sendResponseObject } from "@src/util/misc";
import PwdUtil from "@src/util/PwdUtil";
import SessionUtil from "@src/util/SessionUtil";
import { Users } from "../models/UserData";
import UserCreds from "../models/UserCreds";

// import { logFunctionName } from "../util/logging";

// **** Functions **** //

const checkuser = async (req: IReq, res: IRes) => {
  const [userName] = check.isStr(req.body, ["userName"]);

  try {
    if (!userName) {
      const response = sendResponseObject(
        HttpStatusCodes.BAD_REQUEST,
        "Failed",
        "Error Happened - UserName parameter not found"
      );
      return res.status(HttpStatusCodes.BAD_REQUEST).json(response);
    }

    const userValue: any = await Users.findOne(
      { userName: userName },
      { userCredId: 0 }
    );

    logFunctionName(checkuser.name, "data from db:--> ", userValue);

    if (userValue && _.get(userValue, "userName")) {
      const response = sendResponseObject(
        HttpStatusCodes.OK,
        "Sucess",
        "Username found",
        userValue
      );
      return res.status(HttpStatusCodes.OK).json(response);
    } else {
      const response = sendResponseObject(
        HttpStatusCodes.BAD_REQUEST,
        "Failed",
        "Username not found in db"
      );
      return res.status(HttpStatusCodes.BAD_REQUEST).json(response);
    }
  } catch (error) {
    logFunctionName(checkuser.name, "error --->  ", error);

    const response = sendResponseObject(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Error Happened"
    );
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
};

const createUser = async (req: IReq, res: IRes) => {
  const [userName, password, email, name] = check.isStr(req.body, [
    "userName",
    "password",
    "email",
    "name",
  ]);

  try {
    const query = {
      $or: [{ userName: userName }, { email: email }],
    };
    const results = await Users.find(query, { userCredId: 0 }).exec();
    logFunctionName(createUser.name, "Found users:", results);
    if (results && _.get(results, "length") > 0) {
      const errorResponse = sendResponseObject(
        HttpStatusCodes.BAD_REQUEST,
        "Failed",
        "Email or userName already used.",
        {
          errorResposnse: "Email or userName already used.",
          data: results,
        }
      );

      return res.status(HttpStatusCodes.BAD_REQUEST).json(errorResponse);
    }

    const encryptedPassword = await PwdUtil.getHash(password);

    const userCreds = {
      userName: userName,
      email: email,
      password: encryptedPassword,
    };

    const newUserCreated = new UserCreds(userCreds);
    const credResult = await newUserCreated.save();
    logFunctionName(createUser.name, "result user created", credResult);
    const user = {
      userName: userName,
      email: email,
      name,
      userCredId: newUserCreated._id,
    };
    const newUser = new Users(user);
    const result = await newUser.save();
    logFunctionName(createUser.name, "result user creation", result);

    const { userCredId, ...rest } = result.toObject();

    const response = sendResponseObject(
      HttpStatusCodes.OK,
      "Sucess",
      "User Created",
      rest
    );

    return res.status(HttpStatusCodes.OK).json(response);
  } catch (error) {
    logFunctionName(createUser.name, "error --->  ", error);

    const response = sendResponseObject(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Error Happened"
    );
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
};
/**
 * Login a user.
 */

const login = async (req: IReq, res: IRes) => {
  const [userName, password] = check.isStr(req.body, ["userName", "password"]);

  try {
    const checkUser: any = await Users.findOne(
      { userName: userName },
      { createdDate: 0, modifiedDate: 0 }
    ).exec();

    if (!checkUser) {
      const response = sendResponseObject(
        HttpStatusCodes.BAD_REQUEST,
        "Failed",
        "UserName not found"
      );
      return res.status(HttpStatusCodes.BAD_REQUEST).json(response);
    }

    const getPassword = await UserCreds.findById(checkUser?.userCredId)
      .select("password isAdmin adminType")
      .exec();

    if (!getPassword?.password) {
      const response = sendResponseObject(
        HttpStatusCodes.BAD_REQUEST,
        "Failed",
        "Password not set"
      );
      return res.status(HttpStatusCodes.BAD_REQUEST).json(response);
    }

    const checkPassword = await PwdUtil.compare(
      password,
      getPassword?.password
    );

    if (!checkPassword) {
      const response = sendResponseObject(
        HttpStatusCodes.BAD_REQUEST,
        "Failed",
        "Incorrect Password"
      );
      return res.status(HttpStatusCodes.BAD_REQUEST).json(response);
    }

    const { _id, userCredId, __v, ...rest } = checkUser.toObject();

    const tokens = await Promise.all([
      generateJWT({ adminType: getPassword?.adminType, ...rest }, "Access"),
      generateJWT({ adminType: getPassword?.adminType, ...rest }, "Refresh"),
    ]);

    const userResponse = sendResponseObject(
      HttpStatusCodes.OK,
      "Sucess",
      "Login Sucess",
      {
        ...rest,
        accessToken: tokens[0],
        refreshToken: tokens[1],
        adminType: getPassword?.adminType,
      }
    );

    return res.status(HttpStatusCodes.OK).json(userResponse);
  } catch (error) {
    logFunctionName(login.name, "error --->  ", error);

    const response = sendResponseObject(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Error Happened"
    );
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
};
/**
 * Logout the user.
 */
const logout = (_: IReq, res: IRes) => {
  SessionUtil.clearCookie(res);
  return res.status(HttpStatusCodes.OK).end();
};

const deleteUser = async (req: IReq, res: IRes) => {
  const [userName] = check.isStr(req.body, ["userName"]);

  try {
    // Find and delete the user by userName
    const deletedUser = await Users.findOneAndDelete(
      { userName },
      { _id: 0 }
    ).exec();

    // Check if the user was found and deleted
    if (deletedUser) {
      logFunctionName(
        deleteUser.name,
        "User deleted successfully:",
        deletedUser
      );
      const response = sendResponseObject(
        HttpStatusCodes.OK,
        "Sucess",
        "User deleted successfully:",
        deletedUser
      );
      return res.status(HttpStatusCodes.BAD_REQUEST).json(response);
    } else {
      logFunctionName(deleteUser.name, "No user found with that username.");

      const response = sendResponseObject(
        HttpStatusCodes.BAD_REQUEST,
        "Failed",
        "No user found with that username.",
        {
          errorMessage: "No user found with that username.",
        }
      );
      return res.status(HttpStatusCodes.BAD_REQUEST).json(response);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    logFunctionName(deleteUser.name, "Error deleting user:", error);
    const response = sendResponseObject(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Error Happened while deleting"
    );
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
};

// **** Export default **** //

export default {
  login,
  logout,
  checkuser,
  createUser,
  deleteUser,
} as const;
