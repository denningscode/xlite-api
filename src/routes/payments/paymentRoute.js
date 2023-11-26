import express from "express";
import { getPayments, addPayment, deletePayment, getPayment } from "../../controllers/payments/paymentController.js";

const router = express.Router();

router.get("/all", getPayments);
router.post("/", addPayment)
router.post("/get", getPayment)
router.post("/delete", deletePayment)

export default router;