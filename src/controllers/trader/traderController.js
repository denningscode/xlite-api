import db from "../../config/dbConfig.js";
import cloudinary from "../../config/cloudinary.js";

// @desc Get trader info with trader code
// route POST /trader
// @access Public
const getTrader = (req, res) => {
    const { code } = req.body;

    if (!code) {
        res.status(400).json({
            message: "Field cannot be empty"
        })
    } else {
        const getTrader = `SELECT * FROM traders WHERE trader_code = '${code}'`;

        db.query(getTrader, (error, results) => {
            if (error) {
                res.status(500).json({
                    message: error.message
                })
            } else {
                if (results.length < 1) {
                    res.status(400).json({
                        message: "Invalid trader code"
                    })
                } else {
                    res.status(200).json(results[0])
                }
            }
        }); 


    }
}

// @desc Get trader info with trader ID
// route POST /trader
// @access Public
const getTraderByID = (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            message: "Field cannot be empty"
        })
    } else {
        const getTrader = `SELECT * FROM traders WHERE id = '${id}'`;

        db.query(getTrader, (error, results) => {
            if (error) {
                res.status(500).json({
                    message: error.message
                })
            } else {
                if (results.length < 1) {
                    res.status(400).json({
                        message: "No trader with code"
                    })
                } else {
                    res.status(200).json(results[0])
                }
            }
        }); 


    }
}


// @desc Copy trader with trader code
// route POST /trader/copy
// @access Private
const copyTrader = (req, res) => {
    const { code } = req.body;
    const id = req.user.id;

    if (!code) {
        res.status(400).json({
            message: "Field cannot be empty"
        })
    } else {
        const getTrader = `SELECT * FROM traders WHERE trader_code = '${code}'`;

        db.query(getTrader, (error, results) => {
            if (error) {
                res.status(500).json({
                    message: error.message
                })
            } else {
                if (results.length < 1) {
                    res.status(400).json({
                        message: "Invalid trader code"
                    })
                } else {
                    // update user info
                    const updateUser = `UPDATE users SET copy_trade='${results[0].id}' WHERE id = '${id}'`;
                    db.query(updateUser, (updateError, updateResult) => {
                        if (updateError) {
                            res.status(500).json({
                                message: updateError.message
                            })
                        } else {
                            res.status(200).json("Successfully copied trader")
                        }
                    })
                    
                }
            }
        }); 


    }
}


// @desc Stop copy with trader code
// route POST /trader/stop
// @access Private
const stopCopy = (req, res) => {
    const id = req.user.id;
    // update user info
    const updateUser = `UPDATE users SET copy_trade='NULL' WHERE id = '${id}'`;
    db.query(updateUser, (updateError, updateResult) => {
        if (updateError) {
            res.status(500).json({
                message: updateError.message
            })
        } else {
            res.status(200).json("Successfully stopped copying trader")
        }
    })
}

const addTrader = (req, res) => {
    const { code, rank, benefit, managed, name, email, commission, experience } = req.body;

    const picture = req.files.picture


    if (!code || !rank || !benefit || !picture || !managed || !name || !email || !commission || !experience) {
        res.status(400).json({
            data: "Fields cannot be empty"
        })
    } else {
        cloudinary.v2.uploader.upload(picture.tempFilePath, (fileError, fileResult) => {
            if (fileError) {
                res.status(500).json({
                    data: "An error occured while uploading trader picture",
                })
            } else {
                if (fileResult) {
                    const addTrader = `INSERT INTO 
                        traders (
                            trader_code, 
                            t_rank, 
                            picture, 
                            benefit, 
                            managed, 
                            name, 
                            email, 
                            commission, 
                            experience 
                        ) VALUES (
                            '${code}',
                            '${rank}',
                            '${fileResult.secure_url}',
                            '${benefit}',
                            '${managed}',
                            '${name}',
                            '${email}',
                            '${commission}',
                            '${experience}'
                        )`;

                    db.query(addTrader, (addError, addResult) => {
                        if (addError) {
                            res.status(500).json({
                                data: "An error occured " + addError.message,
                            })
                        } else {
                            if (addResult) {
                                res.status(200).json({
                                    data: "Trader added"
                                })
                            }
                        }
                    })
                }
            }
        })
    }
}

const getTraders = (req, res) => {
    const getTraders = `SELECT * FROM traders`;

    db.query(getTraders, (error, results) => {
        if (error) {
            res.status(500).json({
                data: "An error occured " + error.message
            })
        } else {
            res.status(200).json(results)
        }
    })

}

const deleteTrader = (req, res) => {

    const { id } = req.body;

    const deletePayment = `DELETE FROM traders WHERE id = '${id}'`;

    db.query(deletePayment, (error, results) => {
        if (error) {
            res.status(500).json({
                data: "An error occured " + error.message
            })
        } else {
            res.status(200).json(results)
        }
    })

}




export {
    getTrader,
    getTraderByID,
    copyTrader,
    stopCopy,
    addTrader,
    getTraders,
    deleteTrader
}