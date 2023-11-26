import express from "express";
import { approveFunding, loginAdmin, updateAdmin } from "../../controllers/admin/adminController.js";

const router = express.Router();

router.post("/approve/:id", approveFunding);
router.post("/login", loginAdmin);
router.post("/update", updateAdmin);


export default router;