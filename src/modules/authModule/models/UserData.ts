import mongoose, { Document, Schema } from "mongoose";
import DeletedUser from "./DeletedUserData";

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  userName: string;
  userCredId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  createdDate: any;
  modifiedDate: any;
}

// Define the user schema
const userSchema = new Schema<IUser>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  userCredId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCreds",
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  modifiedDate: {
    type: Date,
    default: Date.now,
  },
});

const historySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  action: {
    type: String,
    enum: ["insert", "update", "delete"],
    required: true,
  },
  userData: {
    userCredId: String,
    userName: String,
    name: String,
    email: String,
    createdDate: Date,
    modifiedDate: Date,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  modifiedDate: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `modifiedDate` before saving
userSchema.pre("save", async function (next) {
  const action = this.isNew ? "insert" : "update";
  if (this.isNew) {
    this.createdDate = new Date(); // Set createdDate only if the document is new
  }
  this.modifiedDate = new Date(); // Update modifiedDate to the current date/time

  await UserHistory.create({
    _userId: this._id,
    action,
    userData: {
      userCredId: this.userCredId,
      userName: this.userName,
      name: this.name,
      email: this.email,
      createdDate: this.createdDate,
      modifiedDate: this.modifiedDate,
    },
  });
  next();
});

userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await UserHistory.create({
      _userId: doc._id,
      action: "delete",
      userData: {
        userCredId: doc.userCredId,
        userName: doc.userName,
        name: doc.name,
        email: doc.email,
        createdDate: doc.createdDate,
        modifiedDate: doc.modifiedDate,
      },
    });

    await DeletedUser.create({
      _userId: doc._id,
      userName: doc.userName,
      name: doc.name,
      email: doc.email,
    });
  }
});

const Users = mongoose.model<IUser>("Users", userSchema);
const UserHistory = mongoose.model("UserHistory", historySchema);

export { Users, UserHistory };
