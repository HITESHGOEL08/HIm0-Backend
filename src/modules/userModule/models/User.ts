import moment from "moment";

// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM =
  "nameOrObj arg must a string or an object " +
  "with the appropriate user keys.";

export enum UserRoles {
  Standard,
  Admin,
}

// **** Types **** //

export interface IUser {
  id: number;
  name: string;
  email: string;
  created: Date;
  role: UserRoles;
  pwdHash?: string;
}

export interface IDBUser {
  _id: number;
  name: string;
  userName: string;
  email: string;
  createdDate?: Date;
  modifiedDate?: Date;
  pwdHash?: string;
}
export interface ISessionUser {
  id: number;
  email: string;
  name: string;
}

// **** Functions **** //

/**
 * Create new User.
 */
function new_(
  name?: string,
  email?: string,
  created?: Date,
  role?: UserRoles,
  pwdHash?: string,
  id?: number // id last cause usually set by db
): IUser {
  return {
    id: id ?? -1,
    name: name ?? "",
    email: email ?? "",
    created: created ? new Date(created) : new Date(),
    role: role ?? UserRoles.Standard,
    ...(pwdHash ? { pwdHash } : {}),
  };
}

/**
 * Get user instance from object.
 */
function from(param: object): IUser {
  if (!isUser(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  return new_(param.name, param.email, param.created, param.id);
}

/**
 * See if the param meets criteria to be a user.
 */
function isUser(arg: unknown): arg is IUser {
  return (
    !!arg &&
    typeof arg === "object" &&
    "id" in arg &&
    typeof arg.id === "number" &&
    "email" in arg &&
    typeof arg.email === "string" &&
    "name" in arg &&
    typeof arg.name === "string" &&
    "created" in arg &&
    moment(arg.created as string | Date).isValid()
  );
}

export default {
  new: new_,
  from,
  isUser,
} as const;
