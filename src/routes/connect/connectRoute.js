import express from "express";
import { connectWallet, getWallets } from "../../controllers/connect/connectController.js";
import verifyToken from "../../middlewares/verify/verifyToken.js";

const router = express.Router();

router.post("/get", getWallets);
router.post("/", connectWallet);




export default router;