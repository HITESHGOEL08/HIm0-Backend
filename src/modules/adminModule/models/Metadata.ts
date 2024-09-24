import mongoose from "mongoose";

const metadataSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  key: { type: String, required: true },
  description: { type: String },
  title: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
});

metadataSchema.index({ key: 1, title: 1 }, { unique: true });
const Metadata = mongoose.model("Metadata", metadataSchema);

export default Metadata;
