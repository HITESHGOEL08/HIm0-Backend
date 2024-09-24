import mongoose from "mongoose";

// Define the userCredsSchema schema
const userCredsSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
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
userCredsSchema.pre("save", function (next) {
  if (this.isNew) {
    this.createdDate = new Date(); // Set createdDate only if the document is new
  }
  this.modifiedDate = new Date(); // Update modifiedDate to the current date/time
  next();
});

const UserCreds = mongoose.model("UserCreds", userCredsSchema);

export default UserCreds;
