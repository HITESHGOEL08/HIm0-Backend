import mongoose, { Document, Schema } from "mongoose";

interface IDeletedUser extends Document {
  _id: mongoose.Types.ObjectId;
  userName: string;
  _userId: mongoose.Schema.Types.ObjectId;
  email: string;
  name: string;
  createdDate: any;
  modifiedDate: any;
}

// Define the user schema
const deletedUserSchema = new Schema<IDeletedUser>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  userName: {
    type: String,
    required: true,
  },
  name: {
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

const DeletedUser = mongoose.model<IDeletedUser>(
  "DeletedUser",
  deletedUserSchema
);

export default DeletedUser;
