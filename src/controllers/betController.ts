import Bet from "../models/Bet";
import { Request, Response } from "express";

const placeBet = async (req: Request, res: Response) => {
  const { userId, amount, odds } = req.body;

  try {
    const newBet = new Bet({ userId, amount, odds });
    await newBet.save();
    res.status(201).json(newBet);
  } catch (error) {
    res.status(400).json({ message: "Error placing bet", error });
  }
};

const getBets = async (req: Request, res: Response) => {
  try {
    const bets = await Bet.find();
    res.json(bets);
  } catch (error) {
    res.status(400).json({ message: "Error fetching bets", error });
  }
};

const getBet = async (req: Request, res: Response) => {
  try {
    const bets = await Bet.find();
    res.json(bets);
  } catch (error) {
    res.status(400).json({ message: "Error fetching bets", error });
  }
};

export default {
  getBet,
  getBets,
  placeBet,
} as const;
