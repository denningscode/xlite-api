import express from "express";
import { createDemoTrade, createTrade, deleteTrade, getDemoTrades, getSingleTrade, getTrades, getTradesById, updateSingleTrade } from "../../controllers/trades/tradeController.js";
import verifyToken from "../../middlewares/verify/verifyToken.js";

const router = express.Router()

router.post("/demo", createDemoTrade);
router.get("/demo/all", verifyToken, getDemoTrades);
router.get("/all", verifyToken, getTrades);
router.get("/single/:id", getSingleTrade);
router.post("/single/:id", updateSingleTrade);
router.get("/all/:id", getTradesById);
router.post("/delete", deleteTrade);
router.post("/add", createTrade);

export default router;