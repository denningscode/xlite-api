import db from "../../config/dbConfig.js";

// @desc Get all user transactions
// route GET transaction/
// @access Private
const getTrancactions = (req, res) => {
    const userId = req.user.id;

    const getTrancactions = `SELECT * FROM transactions WHERE user_id = '${userId}' ORDER BY id DESC`;
    db.query(getTrancactions, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            res.status(200).json(results)
        }
    })
}

const getTrancactionsByID = (req, res) => {
    const userId = req.params.id;

    const getTrancactions = `SELECT * FROM transactions WHERE user_id = '${userId}' ORDER BY id DESC`;
    db.query(getTrancactions, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            res.status(200).json(results)
        }
    })
}

const getSingleTrancaction = (req, res) => {
    const id = req.params.id;

    const getTrancactions = `SELECT * FROM transactions WHERE id = '${id}'`;
    db.query(getTrancactions, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            res.status(200).json(results[0])
        }
    })
}

const updateSingleTrancaction = (req, res) => {
    const id = req.params.id;

    const { type, amount, status } = req.body;

    const updateTrancactions = `UPDATE transactions SET type='${type}',amount='${amount}',status='${status}' WHERE id = '${id}'`;
    db.query(updateTrancactions, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            res.status(200).json(results)
        }
    })
}


// @desc Get all user demo transactions
// route GET transaction/
// @access Private
const getDemoTrancactions = (req, res) => {
    const userId = req.user.id;

    const getTrancactions = `SELECT * FROM demo_transactions WHERE user_id = '${userId}' ORDER BY id DESC`;
    db.query(getTrancactions, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            res.status(200).json(results)
        }
    })
}


// @desc User fund wallet
// route POST /wallet/deposit
// @access Private
const addTransaction = (req, res) => {

    const userId = req.body.id;
    const amount = req.body.amount;
    const status = req.body.status;
    const type = req.body.type;

    if (!amount || !userId || !status || !type) {
        res.status(400).json({
            message: "fields cannot be empty"
        })
    } else {
        // create pending transaction
        const generateRef = Math.floor(1000 + Math.random() * 9999);

        const createTransaction = `INSERT INTO 
        transactions (user_id, ref, type, amount, status) 
        VALUES ('${userId}', '${generateRef}', '${type}', '${amount}', '${status}')`;

        db.query(createTransaction, (error, result) => {
            if (error) {
                res.status(500).json({
                    message: error.message
                });
            } else {
                if (result) {
                    // send email to user with pending transaction summary
                    res.status(200).json({
                        message: "Transaction added"
                    })
                }
            }
        })
        
    } 
}

const deleteTransaction = (req, res) => {

    const { id } = req.body

    if (!id) {
        res.status(400).json({
            message: "fields cannot be empty"
        })
    } else {

        const deleteTransaction = `DELETE FROM transactions WHERE id = '${id}'`;

        db.query(deleteTransaction, (error, result) => {
            if (error) {
                res.status(500).json({
                    message: error.message
                });
            } else {
                if (result) {
                    // send email to user with pending transaction summary
                    res.status(200).json({
                        message: "Transaction deleted"
                    })
                }
            }
        })
        
    } 
}


export { getTrancactions, getDemoTrancactions, getTrancactionsByID, addTransaction, deleteTransaction, getSingleTrancaction, updateSingleTrancaction }