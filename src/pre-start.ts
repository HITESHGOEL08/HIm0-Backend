/**
 * Pre-start is where we want to place things that must run BEFORE the express
 * server is started. This is useful for environment variables, command-line
 * arguments, and cron-jobs.
 */

// NOTE: DO NOT IMPORT ANY SOURCE CODE HERE
import path from "path";
import dotenv from "dotenv";
import { parse } from "ts-command-line-args";

import _ from "lodash";

// **** Types **** //

interface IArgs {
  env: string;
}

// **** Setup **** //

// Command line arguments
const args = parse<IArgs>({
  env: {
    type: String,
    defaultValue: "development",
    alias: "e",
  },
});

(global as any)._ = _;
// Set the env file
const result2 = dotenv.config({
  path: path.join(__dirname, `../env/${args.env}.env`),
});
// console.log(result2);

if (result2.error) {
  throw result2.error;
}
