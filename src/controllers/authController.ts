import HttpStatusCodes from "../common/HttpStatusCodes";
import SessionUtil from "../util/SessionUtil";

import { Users } from "../models/UserData";
import { sendResponseObject } from "../util/misc";
import PwdUtil from "../util/PwdUtil";
import UserCreds from "../models/UserCreds";
import { generateJWT } from "../util/handlingJWT";
import { IReq, IRes } from "../common/types";
import check from "../common/check";

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
    console.log("data from db:--> ", userValue);

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
    console.log("error --->  ", error);

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
    console.log("Found users:", results);
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
    console.log("result user created", credResult);
    const user = {
      userName: userName,
      email: email,
      name,
      userCredId: newUserCreated._id,
    };
    const newUser = new Users(user);
    const result = await newUser.save();
    console.log("result user creation", result);

    const response = sendResponseObject(
      HttpStatusCodes.OK,
      "Sucess",
      "User Created",
      result
    );

    return res.status(HttpStatusCodes.OK).json(response);
  } catch (error) {
    console.log("error --->  ", error);

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
      .select("password")
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
      generateJWT(rest, "Access"),
      generateJWT(rest, "Refresh"),
    ]);

    const userResponse = sendResponseObject(
      HttpStatusCodes.OK,
      "Sucess",
      "Login Sucess",
      {
        ...rest,
        accessToken: tokens[0],
        refreshToken: tokens[1],
      }
    );

    return res.status(HttpStatusCodes.OK).json(userResponse);
  } catch (error) {
    console.log("error --->  ", error);

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
      console.log("User deleted successfully:", deletedUser);
      const response = sendResponseObject(
        HttpStatusCodes.OK,
        "Sucess",
        "User deleted successfully:",
        deletedUser
      );
      return res.status(HttpStatusCodes.BAD_REQUEST).json(response);
    } else {
      console.log("No user found with that username.");
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
