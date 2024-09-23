/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

export default {
  NodeEnv: process.env.NODE_ENV ?? "",
  Port: process.env.PORT ?? 3000,
  mongoDBURL: process.env.DATABASE_URL ?? "",
  globalTimeout: process.env.GLOBAL_TIMEOUT
    ? parseInt(process.env.GLOBAL_TIMEOUT)
    : 120000,
  CookieProps: {
    Key: "RaHa",
    Secret: process.env.COOKIE_SECRET ?? "",
    // Casing to match express cookie options
    Options: {
      httpOnly: true,
      signed: true,
      path: process.env.COOKIE_PATH ?? "",
      maxAge: Number(process.env.COOKIE_EXP ?? 0),
      domain: process.env.COOKIE_DOMAIN ?? "",
      secure: process.env.SECURE_COOKIE === "true",
    },
  },
  Jwt: {
    Secret: process.env.JWT_SECRET ?? "",
    Exp: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "", // exp at the same time as the cookie
    RefreshExp: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "",
  },
} as const;
