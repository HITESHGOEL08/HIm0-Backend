import Paths from "@src/common/Paths";
import BetController from "@src/modules/bettingModule/controllers/betController";

import { Router } from "express";

const bettingApiRouter = Router();
bettingApiRouter.post(Paths.Bets.placeBet, BetController.placeBet);
bettingApiRouter.post(Paths.Bets.getAllBets, BetController.getBets);
bettingApiRouter.post(Paths.Bets.getBet, BetController.getBet);
// **** Export default **** //

export default bettingApiRouter;
