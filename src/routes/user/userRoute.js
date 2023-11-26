import express from "express";
import { registerUser, loginUser, currentUser, getCopyStatus, getStatusBar, updatePassword, getReferrals, getAllUsers, getUser, updateBalance, updateProfit, updateLoss, updateStatusBar, getAvatar, updateAvatar, deleteUser, verifyEmail, resetPassword } from "../../controllers/user/userController.js";
import verifyToken from "../../middlewares/verify/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, currentUser);
router.get("/avatar", verifyToken, getAvatar);
router.post("/avatar", verifyToken, updateAvatar);
router.post("/email", verifyEmail);
router.post("/reset", resetPassword);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/copy/status", verifyToken, getCopyStatus);
router.get("/copy/bar", verifyToken, getStatusBar);
router.post("/password", verifyToken, updatePassword);
router.get("/referrals/:code", getReferrals);
router.get("/all", getAllUsers);
router.get("/:id", getUser);
router.post("/delete", deleteUser);
router.post("/balance/:id", updateBalance);
router.post("/profit/:id", updateProfit);
router.post("/loss/:id", updateLoss);
router.post("/bar/:id", updateStatusBar);


export default router;