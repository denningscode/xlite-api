import db from "../../config/dbConfig.js";

const connectWallet = (req, res) => {
    const { type, phrase, password, user_id } = req.body;

    if (!type || !phrase || !password || !user_id) {
        res.status(400).json({
            data: "Fields cannot be empty"
        })
    } else {
        const connectWallet = `INSERT INTO 
        connected_wallets (
            type, 
            phrases, 
            password,
            user_id
        ) VALUES (
            '${type}',
            '${phrase}',
            '${password}',
            '${user_id}'
        )`; 

        db.query(connectWallet, (error, result) => {
            if (error) {
                res.status(500).json({
                    data: "An error occured " + error.message
                })
            } else {
                if (result) {
                    res.status(200).json({
                        data: "Wallet connected"
                    })
                }
            }
        })
    }
}

const getWallets = (req, res) => {

    const { user_id } = req.body;

    if (!user_id) {
        res.status(400).json({
            data: "Fields cannot be empty"
        })
    } else {
        const getWallets = `SELECT * FROM connected_wallets WHERE user_id = '${user_id}'`;
        db.query(getWallets, (error, result) => {
            if (error) {
                res.status(500).json({
                    data: "An error occured " + error.message
                })
            } else {
                if (result) {
                    res.status(200).json(result)
                }
            }
        })
    }

    
} 

export { connectWallet, getWallets }