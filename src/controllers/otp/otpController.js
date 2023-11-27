import { validate } from "email-validator";
import nodemailer from "nodemailer";
import db from "../../config/dbConfig.js";

// @desc    Request otp with email
// route    POST otp/request
// @access  Public
// const requestOtp = (req, res) => {
//     const { email } = req.body;
//     // check if email input is empty
//     if (!email) {
//         res.status(400).json({
//             message:"Email field cannot be empty"
//         });
//     } else {
//         //check if email is valid
//         if (!validate(email)) {
//             res.status(400).json({
//                 message: "Invalid email address"
//             });
//         } else {
//             //generate and store OTP
//             const otp = Math.floor(1000 + Math.random() * 9000);

//             const storeOtp = `INSERT INTO otp (email, otp) VALUES ('${email.toLowerCase()}', '${otp}')`;
//             db.query(storeOtp, (storeError, storeResult) => {
//                 if (storeError) {
//                     res.status(500).json({
//                         message: storeError.message
//                     });
//                 } else {
//                     if (storeResult) {
//                         //send OTP
//                         // move sensitive info to ENV
//                         const transporter = nodemailer.createTransport({
//                             host: 'smtp-mail.outlook.com',
//                             auth: {
//                               user: 'secure-otp@hotmail.com',
//                               pass: 'denningk2379123#'
//                             }
//                         });

//                         const mailOptions = {
//                             from: 'secure-otp@hotmail.com',
//                             to: email.toLowerCase(),
//                             subject: "Secure OTP",
//                             text: "Your xLite App OTP is " + otp + ". \nDon't share this code with anyone; our employees will never ask for the code"
//                         };
                          
//                         transporter.sendMail(mailOptions, (error, info) => {
//                             if (error) {
//                                 res.status(500).json({
//                                     message: "An error occured " + error.message
//                                 });
//                             } else {
//                                 // time OTP will expire
//                                 const expiresAt = 5 * 60 * 1000;
//                                 // delete otp after 5 mins
//                                 setTimeout(() => {
//                                     const deletOtp = `DELETE FROM otp WHERE email = '${email}' AND otp = '${otp}'`;
//                                     db.query(deletOtp, (deleteError, deleteResult) => {
//                                         if (deleteError) {
//                                             console.log(deleteError.message); 
//                                         } else {
//                                             if (deleteResult) {
//                                                 console.log("otp deleted");
//                                             }
//                                         }
//                                     })
//                                 }, expiresAt);
//                                 res.status(200).json({
//                                     message: 'OTP sent'
//                                 });
//                             }
//                         });
//                     }
//                 }
//             });
//         }
//     }
// }


const requestOtp = (req, res) => {
    const { email } = req.body;

    // Function to handle sending OTP emails
    const sendOtpEmail = (email, otp) => {
        const transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            auth: {
                user: 'secure-otp@hotmail.com',
                pass: 'denningk2379123#',
            },
        });

        const mailOptions = {
            from: 'secure-otp@hotmail.com',
            to: email.toLowerCase(),
            subject: "Secure OTP",
            text: `Your xLite App OTP is ${otp}. \nDon't share this code with anyone; our employees will never ask for the code.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email sending failed:", error);
                res.status(500).json({
                    message: `An error occurred: ${error.message}`,
                });
            } else {
                const expiresAt = 5 * 60 * 1000;

                setTimeout(() => {
                    const deleteOtp = `DELETE FROM otp WHERE email = '${email}' AND otp = '${otp}'`;
                    db.query(deleteOtp, (deleteError, deleteResult) => {
                        if (deleteError) {
                            console.log(deleteError.message);
                        } else {
                            if (deleteResult) {
                                console.log("OTP deleted");
                            }
                        }
                    });
                }, expiresAt);

                res.status(200).json({
                    message: 'OTP sent',
                });
            }
        });
    };

    // Check if email input is empty
    if (!email) {
        res.status(400).json({
            message: "Email field cannot be empty",
        });
        return;
    }

    // Check if email is valid
    if (!validate(email)) {
        res.status(400).json({
            message: "Invalid email address",
        });
        return;
    }

    // Generate and store OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    const storeOtp = "INSERT INTO otp (email, otp) VALUES (?, ?)";
    db.query(storeOtp, [email.toLowerCase(), otp], (storeError, storeResult) => {
        if (storeError) {
            res.status(500).json({
                message: storeError.message,
            });
        } else {
            if (storeResult) {
                // Send OTP email
                sendOtpEmail(email, otp);
            }
        }
    });
};

// @desc    Verify otp with email
// route    POST otp/verify
// @access  Public
const verifyOtp = (req, res) => {
    const { email, otp } = req.body;
    // check if email input is empty
    if (!email || !otp) {
        res.status(400).json({
            message:"Fields cannot be empty"
        });
    } else {
        //validate otp
        const validatOtp = `SELECT * FROM otp WHERE email = '${email}' AND otp = '${otp}'`;
        db.query(validatOtp, (validateError, validateResult) => {
            if (validateError) {
                res.status(500).json({
                    message: validateError.message
                });
            } else {
                if (validateResult.length < 1) {
                    res.status(400).json({
                        message: "Invalid otp"
                    }); 
                } else {
                    res.status(200).json({
                        message: "User email verified"
                    }); 
                }
            }
        });
    }
}

export { requestOtp, verifyOtp }
