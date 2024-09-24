import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import EnvVars from "@src/common/EnvVars";
import { logger } from "../util/logging";

export const connectToDatabase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (mongoose.connection.readyState === 0) {
    // 0 = disconnected
    try {
      await mongoose
        .connect(EnvVars.mongo.mongoDBURL, {
          dbName: EnvVars.mongo.mongoDB,
          serverSelectionTimeoutMS: 20000,
        })
        .then(() => logger.info("MongoDB connected successfully"))
        .catch((err) => logger.error("MongoDB connection error:", err));
    } catch (error) {
      logger.error("MongoDB connection error:", error);
      return res.status(500).json({ error: "Database connection error" });
    }
  } else {
    logger.info("MongoDB is already connected.");
  }
  next(); // Proceed to the next middleware/route handler
};

export const closeDatabaseConnection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed.");
  next(); // Proceed to the next middleware/route handler
};
