import express from "express";
import { getTrader, copyTrader, stopCopy, getTraderByID, addTrader, getTraders, deleteTrader } from "../../controllers/trader/traderController.js";
import verifyToken from "../../middlewares/verify/verifyToken.js";

const router = express.Router();

router.post("/", getTrader);
router.get("/all", getTraders);
router.post("/delete", deleteTrader);
router.post("/copy", verifyToken, copyTrader);
router.post("/add", addTrader);
router.get("/stop", verifyToken, stopCopy);
router.get("/:id", getTraderByID);


export default router