import express from "express";
import verifyToken from "../../middlewares/verify/verifyToken.js";

import { 
    getUserWallet,
    getUserDemoWallet, 
    deposit, 
    withdraw, 
    depositDemo,
    updateDemoBalance,
    updateDemoProfit,
    getUserWalletByID
} from "../../controllers/wallet/walletController.js";

const router = express.Router();

router.get("/", verifyToken, getUserWallet);
//router.get("/:id", getUserWalletByID);
router.get("/demo", verifyToken, getUserDemoWallet);
router.post("/deposit", verifyToken, deposit);
router.post("/deposit/demo", verifyToken, depositDemo);
router.post("/withdraw", verifyToken, withdraw);
router.post("/balance/demo", verifyToken, updateDemoBalance);
router.post("/profit/demo", verifyToken, updateDemoProfit);

export default router;