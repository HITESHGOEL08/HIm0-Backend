import { RouteError } from "@src/common/classes";
import EnvVars from "@src/common/EnvVars";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import jsonwebtoken from "jsonwebtoken";
import { generateKeyPairSync } from 'crypto'

export const Errors = {
  ParamFalsey: "Param is falsey",
  Validation: "JSON-web-token validation failed.",
} as const;


export function generatePrivateKeyStub (): string {
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  })
  return privateKey.export({
    format: 'pem',
    type: 'pkcs1',
  }) as string
}

const AccessTokenOptions = {
  expiresIn: EnvVars.Jwt.Exp,
};
const RefreshTokenOptions = {
  expiresIn: EnvVars.Jwt.RefreshExp,
};
/**
 * Encrypt data and return jwt.
 */

export const generateJWT = (
  data: string | object | Buffer,
  type: "Access" | "Refresh"
): Promise<string> => {
  let Options = {};

  if (type === "Access") {
    Options = AccessTokenOptions;
  } else {
    Options = RefreshTokenOptions;
  }

  return new Promise((res, rej) => {
    jsonwebtoken.sign(data, EnvVars.Jwt.Secret, Options, (err, token) => {
      return err ? rej(err) : res(token ?? "");
    });
  });
};

/**
 * Decrypt JWT and extract client data.
 */
export const decordJWT = <T>(jwt: string): Promise<string | undefined | T> => {
  return new Promise((res, rej) => {
    jsonwebtoken.verify(jwt, EnvVars.Jwt.Secret, (err, decoded) => {
      if (!!err) {
        const err = new RouteError(
          HttpStatusCodes.UNAUTHORIZED,
          Errors.Validation
        );
        return rej(err);
      } else {
        return res(decoded as T);
      }
    });
  });
};
