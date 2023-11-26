import db from "../../config/dbConfig.js";
import cloudinary from "../../config/cloudinary.js";

const getPayments = (req, res) => {
    const getPayments = `SELECT * FROM payment_methods`;

    db.query(getPayments, (error, results) => {
        if (error) {
            res.status(500).json({
                data: "An error occured " + error.message
            })
        } else {
            res.status(200).json(results)
        }
    })

}

const getPayment = (req, res) => {

    const { id } = req.body;

    if (!id) {
        res.status(400).json({
            data: "Fields cannot be empty"
        })
    } else {
        const getPayment = `SELECT * FROM payment_methods WHERE id = ${id}`;

    db.query(getPayment, (error, results) => {
        if (error) {
            res.status(500).json({
                data: "An error occured " + error.message
            })
        } else {
            res.status(200).json(results[0])
        }
    })
    }
    

}

const deletePayment = (req, res) => {

    const { id } = req.body;

    const deletePayment = `DELETE FROM payment_methods WHERE id = '${id}'`;

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

const addPayment = (req, res) => {
    const { type, abbr, address, network } = req.body;

    const qrcode = req.files.qrcode


    if (!type || !abbr || !address || !network || !qrcode) {
        res.status(400).json({
            data: "Fields cannot be empty"
        })
    } else {
        cloudinary.v2.uploader.upload(qrcode.tempFilePath, (fileError, fileResult) => {
            if (fileError) {
                res.status(500).json({
                    data: "An error occured while uploading QR code",
                })
            } else {
                if (fileResult) {
                    const addPayment = `INSERT INTO 
                        payment_methods (
                            wallet_type, 
                            abbr, 
                            qrcode, 
                            address, 
                            network
                        ) VALUES (
                            '${type}',
                            '${abbr}',
                            '${fileResult.secure_url}',
                            '${address}',
                            '${network}'
                        )`;

                    db.query(addPayment, (addError, addResult) => {
                        if (addError) {
                            res.status(500).json({
                                data: "An error occured " + addError.message,
                            })
                        } else {
                            if (addResult) {
                                res.status(200).json({
                                    data: "Payment method added"
                                })
                            }
                        }
                    })
                }
            }
        })
    }
}




export { getPayments, addPayment, deletePayment, getPayment }