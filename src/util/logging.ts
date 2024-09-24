import EnvVars from "@src/common/EnvVars";
import { closeDatabaseConnection } from "@src/middleware/dbMW";
import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const transport: DailyRotateFile = new DailyRotateFile({
  filename: "application-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "30m",
  maxFiles: "30d",
  dirname: EnvVars.logging.transportServerPath,
});

// Configure Winston logger
export const logger = winston.createLogger({
  level: "verbose",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    transport,
    new winston.transports.File({ filename: EnvVars.logging.serverPath }),
  ],
});

export const logFunctionName = (func: any, ...args: any) => {
  logger.info("");
  logger.info({
    func: func?.name ? func?.name : func,
    ...args,
  });
  logger.info("");
};

export const requestLogger =  (req: any, res: any, next: any) => {
  const { method, url, headers } = req;
  const start = Date.now();

  // Log the request details
  console.log();
  console.log();
  logger.info("");
  logger.info("----------API REQUEST START------");
  logger.info({
    method,
    url,
    message: "Request received",
    headers,
  });



  let originalWrite = res.write;
  let originalEnd = res.end;
  let responseBody = "";
  res.headers = headers;

  // Intercept the `res.write` method
  res.write = function (chunk: any, encoding: any, callback: any) {
    responseBody += chunk;
    originalWrite.call(res, chunk, encoding, callback);
  };

  // Intercept the `res.end` method
  res.end = function (chunk: any, encoding: any, callback: any) {
    if (chunk) {
      responseBody += chunk;
    }
    originalEnd.call(res, chunk, encoding, callback);
  };

  // Middleware to log response details
  res.on("finish",  async () => {
    const duration = Date.now() - start;
    const { statusCode, statusMessage, headers } = res;
  
    logger.info("----------------");
    logger.info({
      responseBody:
        statusCode !== 200 || statusCode !== 201 || url.includes("api-docs")
          ? responseBody.trim()
          : responseBody.trim(),
    });
    logger.info("----------------");

    logger.info({
      method,
      url,
      statusCode,
      duration,
      statusMessage,
      headers,
      message: "Request completed",
    });
    logger.info("----------API REQUEST END------");
    logger.info("");
    await closeDatabaseConnection(req, res, next);
    console.log();
    console.log();
    
  });

  // Call the next middleware
  next();
};

export default { logFunctionName, requestLogger } as const;
