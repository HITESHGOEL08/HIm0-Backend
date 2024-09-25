import HttpStatusCodes from "@src/common/HttpStatusCodes";
import initialData from "@src/common/jsons/metaData.json";

import Metadata from "../models/Metadata";
import { NextFunction, Request, Response } from "express";
import { logFunctionName, logger } from "@src/util/logging";
import check from "@src/common/check";
import { sendResponseObject } from "@src/util/misc";

const initializeMetadata = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logFunctionName(initializeMetadata, "reqBody--> ", req.body);

  const [userName] = check.isStr(req.body, ["userName"]);

  if (userName && userName === "admin") {
    logFunctionName(initializeMetadata, "reqBody--> pass");
    for (const metadataArray of Object.values(initialData)) {
      for (const data of metadataArray) {
        try {
          const { key, title, description } = data;
          await Metadata.updateOne(
            { key, title }, // Query to find the document
            {
              $setOnInsert: {
                description,
                createdDate: new Date(),
                modifiedDate: new Date(),
              },
            },
            { upsert: true } // Upsert option
          );
          logger.info(
            `Checked and added metadata for key: ${key}, title: ${title}`
          );
        } catch (error) {
          logger.error("Error adding metadata:", error);
        }
      }
    }
    res.status(HttpStatusCodes.OK).json({ status: "DONE" });
  } else {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ status: "Auth Failed" });
  }
};

const getMetadata = async (req: Request, res: Response, next: NextFunction) => {
  const reqBody = req.body;

  logFunctionName(getMetadata, "reqBody--> ", reqBody);

  const [key] = check.isStr(reqBody, ["key"]);

  try {
    if (!key) {
      const response = sendResponseObject(
        HttpStatusCodes.BAD_REQUEST,
        "Failed",
        "Error Happened - key parameter not found"
      );
      return res.status(HttpStatusCodes.BAD_REQUEST).json(response);
    }
    const data = await Metadata.find(
      { key: key },
      { __v: 0, createdDate: 0, modifiedDate: 0 }
    ).exec();

    logFunctionName(getMetadata, "data response--> ", data);
    const response = sendResponseObject(
      HttpStatusCodes.OK,
      "Sucess",
      "Data found",
      data
    );
    return res.status(HttpStatusCodes.OK).json(response);
  } catch (error) {
    logFunctionName(getMetadata, "error --->  ", error);

    const response = sendResponseObject(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Error Happened"
    );
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
};

const addMetaData = async (req: Request, res: Response, next: NextFunction) => {
  const reqBody = req.body;

  logFunctionName(getMetadata, "reqBody--> ", reqBody);

  const [key, title, description] = check.isStr(reqBody, [
    "key",
    "title",
    "description",
  ]);

  try {
    if (!key || !title) {
      const response = sendResponseObject(
        HttpStatusCodes.BAD_REQUEST,
        "Failed",
        "Error Happened - key | title parameter not found"
      );
      return res.status(HttpStatusCodes.BAD_REQUEST).json(response);
    }
    const data = await Metadata.updateOne(
      { key, title }, // Query to find the document
      {
        $setOnInsert: {
          description,
          createdDate: new Date(),
          modifiedDate: new Date(),
        },
      },
      { upsert: true } // Upsert option
    ).exec();

    logFunctionName(getMetadata, "data response--> ", data);
    const response = sendResponseObject(
      HttpStatusCodes.OK,
      "Sucess",
      "Data found",
      data
    );
    return res.status(HttpStatusCodes.OK).json(response);
  } catch (error) {
    logFunctionName(getMetadata, "error --->  ", error);

    const response = sendResponseObject(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Error Happened"
    );
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }
};

export default { initializeMetadata, getMetadata, addMetaData } as const;
