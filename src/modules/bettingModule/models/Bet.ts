import mongoose, { Document, Schema } from "mongoose";

export interface Bet extends Document {
  _id: string;
  userId: string;
  amount: number;
  odds: number;
  status: "pending" | "won" | "lost";
}

const BetSchema: Schema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  odds: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "won", "lost"],
    default: "pending",
  },
});


const  Bet = mongoose.model<Bet>("Bet", BetSchema);

export default Bet;