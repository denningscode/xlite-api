import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import userRoute from "./src/routes/user/userRoute.js";
import walletRoute from "./src/routes/wallet/walletRoute.js";
import adminRoute from "./src/routes/admin/adminRoute.js";
import transactionRoute from "./src/routes/transactions/transactionsRoute.js";
import tradeRoute from "./src/routes/trades/tradeRoute.js";
import traderRoute from "./src/routes/trader/traderRoute.js";
import paymentRoute from "./src/routes/payments/paymentRoute.js";
import otpRoute from "./src/routes/otp/otpRoute.js";
import connectRoute from "./src/routes/connect/connectRoute.js";

const app = express();
const port = 5577;

app.use(express.json());
app.use(fileUpload({
    useTempFiles : true
}));

app.use(cors({
    origin: "*"
}));

app.get("/", (req, res) => res.send("It works"))

app.use("/user", userRoute);
app.use("/wallet", walletRoute);
app.use("/admin", adminRoute);
app.use("/transaction", transactionRoute);
app.use("/trade", tradeRoute);
app.use("/trader", traderRoute);
app.use("/payment", paymentRoute);
app.use("/otp", otpRoute);
app.use("/connect", connectRoute);

app.listen(port, () => console.log("Server running on port "  + port));
