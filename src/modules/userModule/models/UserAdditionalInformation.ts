import DeletedUser from "@src/modules/authModule/models/DeletedUserData";
import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  dob: {
    type: String,
  },
  gender: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  hobbiesId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Metadata", // Reference to the Metadata model
    },
  ],
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
    userId: String,
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

  await UserAdditionalInformationHistory.create({
    _userId: this._id,
    action,
    userData: {
      userId: this.userId,
      createdDate: this.createdDate,
      modifiedDate: this.modifiedDate,
    },
  });
  next();
});

userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await UserAdditionalInformationHistory.create({
      _userId: doc._id,
      action: "delete",
      userData: {
        userCredId: doc.userCredId,
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

const UserAdditionalInformation = mongoose.model(
  "UserAdditionalInformation",
  userSchema
);
const UserAdditionalInformationHistory = mongoose.model(
  "UserAdditionalInformationHistory",
  historySchema
);

export { UserAdditionalInformation };
