import db from "../../config/dbConfig.js";
import { DEPOSIT_TYPE, WITHDRAW_TYPE } from "../../constants/constants.js";

// @desc Get user wallet
// route GET /wallet
// @access Private
const getUserWallet = (req, res) => {
    const userId = req.user.id;
    
    const getWallet = `SELECT * FROM wallets WHERE user_id = '${userId}'`;
    db.query(getWallet, (error, result) => {
        if (error) {
            res.status(500).json({
                message: error.message
            });
        } else {
            if (result.length < 1) {
                res.status(400).json({
                    message: "No wallet was created for you, message surpport"
                });
            } else {
                res.status(200).json({
                    wallet_id: result[0].id,
                    user_id: result[0].user_id,
                    balance: result[0].balance,
                    profit: result[0].profit,
                    loss: result[0].loss
                });
            }
        }
    });
}

const getUserWalletByID = (req, res) => {
    const userId = req.params.id;
    
    const getWallet = `SELECT * FROM wallets WHERE user_id = '${userId}'`;
    db.query(getWallet, (error, result) => {
        if (error) {
            res.status(500).json({
                message: error.message
            });
        } else {
            if (result.length < 1) {
                res.status(400).json({
                    message: "No wallet was created for you, message surpport"
                });
            } else {
                res.status(200).json({
                    wallet_id: result[0].id,
                    user_id: result[0].user_id,
                    balance: result[0].balance,
                    profit: result[0].profit,
                    loss: result[0].loss
                });
            }
        }
    });
}

// @desc Get user wallet
// route GET /wallet/demo
// @access Private
const getUserDemoWallet = (req, res) => {
    const userId = req.user.id;
    
    const getWallet = `SELECT * FROM demo_wallets WHERE user_id = '${userId}'`;
    db.query(getWallet, (error, result) => {
        if (error) {
            res.status(500).json({
                message: error.message
            });
        } else {
            if (result.length < 1) {
                res.status(400).json({
                    message: "No wallet was created for you, please message support"
                });
            } else {
                res.status(200).json({
                    wallet_id: result[0].id,
                    user_id: result[0].user_id,
                    balance: result[0].balance,
                    profit: result[0].profit,
                    loss: result[0].loss
                });
            }
        }
    });
}


// @desc User fund wallet
// route POST /wallet/deposit
// @access Private
const deposit = (req, res) => {

    const userId = req.user.id;
    const amount = req.body.amount;

    if (!amount) {
        res.status(400).json({
            message: "Amount field cannot be empty"
        })
    } else {
        // create pending transaction
        const generateRef = Math.floor(1000 + Math.random() * 9999);

        const createTransaction = `INSERT INTO 
        transactions (user_id, ref, type, amount) 
        VALUES ('${userId}', '${generateRef}', '${DEPOSIT_TYPE}', '${amount}')`;

        db.query(createTransaction, (error, result) => {
            if (error) {
                res.status(500).json({
                    message: error.message
                });
            } else {
                if (result) {
                    // send email to user with pending transaction summary
                    res.status(200).json({
                        message: "Transaction complete"
                    })
                }
            }
        })
        
    } 
}



// @desc User fund demo wallet
// route POST /wallet/deposit/demo
// @access Private
const depositDemo = (req, res) => {

    const userId = req.user.id;

    // create pending transaction
    const generateRef = Math.floor(1000 + Math.random() * 9999);
   

    const createTransaction = `INSERT INTO 
    demo_transactions (user_id, ref) 
    VALUES ('${userId}', '${generateRef}')`;

    db.query(createTransaction, (error, result) => {
        if (error) {
            res.status(500).json({
                message: error.message
            });
        } else {
            if (result) {
                // update user demo wallet back to 10000
                const updateDemo = `UPDATE demo_wallets SET balance='10000.00', profit='0.00', loss='0.00' WHERE user_id='${userId}'`;

                db.query(updateDemo, (updateError, updateResult) => {
                    if (updateError) {
                        res.status(500).json({
                            message: updateError.message
                        });
                    } else {
                        if (updateResult) {
                            res.status(200).json({
                                message: "Transaction complete"
                            })
                        }
                    }
                })
            }
        }
    })
        

}


// @desc Update demo wallet balance - this is before placing trade
// route POST /wallet/balance/demo
// @access Private
const updateDemoBalance = (req, res) => {
    const userId = req.user.id;

    const { new_balance } = req.body
   
    // update user demo wallet balance to deducted balance
    const updateDemoBalance = `UPDATE demo_wallets SET balance='${new_balance}' WHERE user_id='${userId}'`;

    db.query(updateDemoBalance, (updateError, updateResult) => {
        if (updateError) {
            res.status(500).json({
                message: updateError.message
            });
        } else {
            if (updateResult) {
                res.status(200).json({
                    message: "Update complete"
                })
            }
        }
    })
}


// @desc Update demo wallet profit - this is after closing trade
// route POST /wallet/profit/demo
// @access Private
const updateDemoProfit = (req, res) => {
    const userId = req.user.id;

    const { new_profit } = req.body
   
    // update user demo wallet balance to deducted balance
    const updateDemoProfit = `UPDATE demo_wallets SET profit='${new_profit}' WHERE user_id='${userId}'`;

    db.query(updateDemoProfit, (updateError, updateResult) => {
        if (updateError) {
            res.status(500).json({
                message: updateError.message
            });
        } else {
            if (updateResult) {
                res.status(200).json({
                    message: "Update complete"
                })
            }
        }
    })
  
        

}

// @desc Withdraw from user waller
// route POST /wallet/withdraw
// @access Private
const withdraw = (req, res) => {
    const userId = req.user.id;
    const {amount, address, network, wallet_type} = req.body;


    if (!amount || !address || !network || !wallet_type) {
        res.status(400).json({
            message: "Fields cannot be empty"
        })
    } else {
        // get sum of balance and profit 
        const checkTotalBalance = `SELECT * FROM wallets WHERE user_id = '${userId}'`;
        db.query(checkTotalBalance, (checkError, checkResult) => {
            if (checkError) {
                res.status(500).json({
                    message: checkError.message
                });
            } else {
                if (checkResult) {
                    const totalBalance = parseFloat(checkResult[0].balance) + parseFloat(checkResult[0].profit);
                    const amountToFloat = parseFloat(amount);
                    

                    if (amountToFloat > totalBalance) {
                        res.status(400).json({
                            message: "Insufficient balance"
                        });
                    } else {
                        if (amountToFloat < 1) {
                            res.status(400).json({
                                message: "Cannot withdraw 0 amount"
                            });
                        } else {
                            // create withdraw transaction
                            const generateRef = Math.floor(1000 + Math.random() * 9999);

                            const createTransaction = `INSERT INTO 
                            transactions (user_id, ref, type, amount) 
                            VALUES ('${userId}', '${generateRef}', '${WITHDRAW_TYPE}', '${amount}')`;

                            db.query(createTransaction, (error, result) => {
                                if (error) {
                                    res.status(500).json({
                                        message: error.message
                                    });
                                } else {
                                    if (result) {
                                        // send email to user with pending transaction summary
                                        res.status(200).json({
                                            message: "Transaction complete"
                                        })
                                    }
                                }
                            })
                        }

                    }    
                }
            }
        }); 
    }
}



export { 
    getUserWallet, 
    getUserDemoWallet, 
    deposit, 
    withdraw, 
    depositDemo ,
    updateDemoBalance,
    updateDemoProfit,
    getUserWalletByID
}