import express from "express";
import { getTrancactions, getDemoTrancactions, getTrancactionsByID, addTransaction, deleteTransaction, getSingleTrancaction, updateSingleTrancaction } from "../../controllers/transactions/transactionsController.js";
import verifyToken from "../../middlewares/verify/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getTrancactions);
router.get("/:id", getTrancactionsByID);
router.get("/single/:id", getSingleTrancaction);
router.post("/single/:id", updateSingleTrancaction);
router.get("/demo", verifyToken, getDemoTrancactions);
router.post("/add", addTransaction);
router.post("/delete", deleteTransaction);


export default router;