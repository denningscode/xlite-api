import db from "../../config/dbConfig.js";


const createTrade = (req, res) => {
    const {
        user_id,
        asset,
        stake,
        buy_sell,
        status,
        trade_result,
        win_loss,
        leverage
    } = req.body

    const generateRef = Math.floor(1000 + Math.random() * 9999);

    if (!user_id || !asset || !stake || !buy_sell || !status || !trade_result || !win_loss || !leverage) {
        res.status(400).json({
            message: "Fields cannot be empty"
        })
    } else {
        // create trade
        const createTrade = `INSERT INTO 
        trades (
            user_id, 
            trade_id, 
            asset, 
            stake, 
            buy_sell, 
            status, 
            trade_result, 
            leverage,
            win_loss
        ) VALUES (
            '${user_id}',
            '${generateRef}',
            '${asset}',
            '${stake}',
            '${buy_sell}',
            '${status}',
            '${trade_result}',
            '${leverage}',
            '${win_loss}'
        )`;

        db.query(createTrade, (error, result) => {
            if (error) {
                res.status(500).json({
                    message: error.message
                })
            } else {
                if (result) {

                    // add to profit or loss
                    if (win_loss === "WIN") {
                        // get old wallet detail
                        const getWallet = `SELECT * FROM wallets WHERE user_id = '${user_id}'`;
                        db.query(getWallet, (getError, getResult) => {
                            if (getError) {
                                res.status(500).json({
                                    message: "An error occured " + getError.message
                                })
                            } else {
                                if (getResult) {
                                    //old profit
                                    const oldProfit = getResult[0].profit;
                                    // update profit now
                                    const updateProfit = `UPDATE wallets SET profit = '${parseFloat(oldProfit) + parseFloat(trade_result)}' WHERE user_id = '${user_id}'`;
                                    db.query(updateProfit, (upError, upResult) => {
                                        if (upError) {
                                            res.status(500).json({
                                                message: "An error occured " + upError.message
                                            })
                                        } else {
                                            if (upResult) {
                                                res.status(200).json({
                                                    message: "Trade added"
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        // for loss
                        // get old wallet detail
                        const getWallet = `SELECT * FROM wallets WHERE user_id = '${user_id}'`;
                        db.query(getWallet, (getError, getResult) => {
                            if (getError) {
                                res.status(500).json({
                                    message: "An error occured " + getError.message
                                })
                            } else {
                                if (getResult) {
                                    //old loss
                                    const oldLoss = getResult[0].loss;
                                    // update loss now
                                    const updateLoss = `UPDATE wallets SET loss = '${parseFloat(oldLoss) + parseFloat(trade_result)}' WHERE user_id = '${user_id}'`;
                                    db.query(updateLoss, (upError, upResult) => {
                                        if (upError) {
                                            res.status(500).json({
                                                message: "An error occured " + upError.message
                                            })
                                        } else {
                                            if (upResult) {
                                                res.status(200).json({
                                                    message: "Trade added"
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                    
                }
            }
        });
    }
}


// @desc Get demo trades
// route GET /trade/demo/all
// @access Private
const getDemoTrades = (req, res) => {

    const userId = req.user.id;

    const getTrades = `SELECT * FROM demo_trades WHERE user_id = '${userId}' ORDER BY id DESC`;;
    db.query(getTrades, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            if (results) {
                res.status(200).json(results)
            }
        }
    })
}



// @desc Get demo trades
// route GET /trade/all
// @access Private
const getTrades = (req, res) => {

    const userId = req.user.id;

    const getTrades = `SELECT * FROM trades WHERE user_id = '${userId}' ORDER BY id DESC`;;
    db.query(getTrades, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            if (results) {
                res.status(200).json(results)
            }
        }
    })
}

const getTradesById = (req, res) => {

    const userId = req.params.id;

    const getTrades = `SELECT * FROM trades WHERE user_id = '${userId}' ORDER BY id DESC`;;
    db.query(getTrades, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            if (results) {
                res.status(200).json(results)
            }
        }
    })
}

const getSingleTrade = (req, res) => {

    const id = req.params.id;

    const getTrades = `SELECT * FROM trades WHERE id = '${id}'`;;
    db.query(getTrades, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            if (results) {
                res.status(200).json(results[0])
            }
        }
    })
}

const updateSingleTrade = (req, res) => {

    const id = req.params.id;

    const {asset, stake, buy_sell, status, trade_result, win_loss, leverage} = req.body;

    const getTrades = `UPDATE trades SET asset='${asset}',stake='${stake}',buy_sell='${buy_sell}',status='${status}',trade_result='${trade_result}',win_loss='${win_loss}',leverage='${leverage}' WHERE id = '${id}'`;;
    db.query(getTrades, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            if (results) {
                res.status(200).json(results[0])
            }
        }
    })
}

const deleteTrade = (req, res) => {

    const { id } = req.body

    if (!id) {
        res.status(400).json({
            message: "fields cannot be empty"
        })
    } else {

        const deleteTransaction = `DELETE FROM trades WHERE id = '${id}'`;

        db.query(deleteTransaction, (error, result) => {
            if (error) {
                res.status(500).json({
                    message: error.message
                });
            } else {
                if (result) {
                    // send email to user with pending transaction summary
                    res.status(200).json({
                        message: "Trade deleted"
                    })
                }
            }
        })
        
    } 
}

// @desc Create new demo trade
// route POST /trade/demo
// @access Private
const createDemoTrade = (req, res) => {
    const {
        user_id,
        trade_id,
        asset,
        stake,
        buy_sell,
        status,
        trade_result,
        win_loss,
        leverage
    } = req.body

    if (!user_id || !trade_id || !asset || !stake || !buy_sell || !status || !trade_result || !win_loss || !leverage) {
        res.status(400).json({
            message: "Fields cannot be empty"
        })
    } else {
        // create trade
        const createTrade = `INSERT INTO 
        demo_trades (
            user_id, 
            trade_id, 
            asset, 
            stake, 
            buy_sell, 
            status, 
            trade_result, 
            leverage,
            win_loss
        ) VALUES (
            '${user_id}',
            '${trade_id}',
            '${asset}',
            '${stake}',
            '${buy_sell}',
            '${status}',
            '${trade_result}',
            '${leverage}',
            '${win_loss}'
        )`;

        db.query(createTrade, (error, result) => {
            if (error) {
                res.status(500).json({
                    message: error.message
                })
            } else {
                if (result) {
                    res.status(200).json({
                        message: "Trade added"
                    })
                }
            }
        });
    }
}


export { createDemoTrade, getDemoTrades, getTrades, getTradesById, deleteTrade, createTrade, getSingleTrade, updateSingleTrade }