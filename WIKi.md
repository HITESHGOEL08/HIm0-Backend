Himeo Backend

* Template - api call
    # import { NextFunction, Request, Response } from "express";
    # import HttpStatusCodes from "@src/common/HttpStatusCodes";
    # import { logFunctionName, logger } from "@src/util/logging";
    # import check from "@src/common/check";
    # import { sendResponseObject } from "@src/util/misc";

    # const getAllUsers = async (
    #  req: Request,
    #  res: Response,
    #  next: NextFunction
    # ) => {
    #    logFunctionName(getAllUsers, "reqBody--> ", req.body);
    #    try {
    #    } catch (error) {
    #      logFunctionName(getAllUsers, "error --->  ", error);
    #
    #      const response = sendResponseObject(
    #        HttpStatusCodes.INTERNAL_SERVER_ERROR,
    #        "Failed",
    #        "Error Happened"
    #      );
    #      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
    #    }
    # };


- Auth 
    - inquireUser
        - userName
    ** Validates user is db and Returns user info based on Username, accesstoken will not come
    
    - login
        - userName
        - password
    ** Validates user is db and verify creds and Returns user basic information with access and refresh token max 5 tries
      access token valid for 45 mins and refresh token api will be called.

    - resetPassword
        - userName
        - password

    ** Resets password

    - createUser
        - userName
        - password
        - name
        - email

    ** Creates user is db and Returns user basic information with access and refresh token

    - logout 
        - userName
        - accessToken

   ** logout's user

    - deleteUser
        - userName
        - accessToken

   ** Creates user is db and Returns user basic information with access and refresh token

    - refreshToken
        - username
        - refreshToken
    ** validates user and returns refreshtoken

    - verifyemail - get 
        - userName
        - token
    ** verifies email




- UserInfo
    - 

