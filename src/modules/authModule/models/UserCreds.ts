import mongoose, { Document, Schema } from "mongoose";

interface IUserCreds extends Document {
  _id: mongoose.Types.ObjectId;
  userName: string;
  password: string;
  email: string;
  isAdmin: boolean;
  adminType: "" | "Admin" | "Super Admin";
  createdDate: any;
  modifiedDate: any;
}

// Define the userCredsSchema schema
const userCredsSchema = new Schema<IUserCreds>({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  adminType: {
    type: String,
    required: function () {
      return this.isAdmin; // Use a regular function to access `this`
    },
    enum: ["", "Admin", "Super Admin"], // Restrict to these values
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
userCredsSchema.pre<IUserCreds>("save", function (next) {
  if (this.isAdmin) {
    // If adminType is not provided or is not "Super Admin", set it to "Admin"
    if (this.adminType !== "Super Admin") {
      this.adminType = "Admin";
    }
  }
  if (this.isNew) {
    this.createdDate = new Date(); // Set createdDate only if the document is new
  }
  this.modifiedDate = new Date(); // Update modifiedDate to the current date/time
  next();
});

const UserCreds = mongoose.model<IUserCreds>("UserCreds", userCredsSchema);

export default UserCreds;
