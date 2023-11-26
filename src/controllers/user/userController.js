import { validate } from "email-validator";
import jwt from "jsonwebtoken";
import db from "../../config/dbConfig.js";
import cloudinary from "../../config/cloudinary.js";


// @desc Register a new user
// route POST /user/register
// access Public
const registerUser = (req, res) => {
    const { firstname, lastname, email, phone, country, password, referred_by} = req.body;

    const randomNumber = Math.floor(Math.random() * 999)
    //generate referral code
    const referralCode = `XLTE${randomNumber}${firstname[0]}${firstname[1]}${lastname[0]}${lastname[1]}`

    //check if all field are filled
    if (!firstname || !lastname || !email || !phone || !country || !password) {
        res.status(400).json({
            data: "Fields cannot be empty"
        });
    } else {
        //check if email is valid
        if (!validate(email.toLowerCase())) {
            res.status(400).json({
                data: "Invalid email address"
            })
        } else {
            //check if user exists
            const checkUser = `SELECT * FROM users WHERE email = '${email}'`;
            db.query(checkUser, (error, results) => {
                if (error) {
                    res.status(500).json({
                        data: error.message
                    });
                } else {
                    if (results.length > 0) {
                        res.status(400).json({
                            data: "User aready exists"
                        })
                    } else {
                        //register user here
                        const registerUser = `INSERT INTO users(firstname, lastname, email, phone, country, password, referral_code, referred_by) 
                        VALUES ('${firstname}','${lastname}','${email.toLowerCase()}','${phone}','${country}','${password}', '${referralCode}', '${!referred_by ? "null" : referred_by}')`;
                        
                        db.query(registerUser, (error, result) => {
                            if (error) {
                                res.status(500).json({
                                    data: error.message
                                });
                            } else {
                                if (result) {
                                    //create wallet for user generate token for user
                                    //check if wallet exists for user 
                                    const checkWallet = `SELECT * FROM wallets WHERE user_id = '${result.insertId}'`;
                                    db.query(checkWallet, (walletError, walletResults) => {
                                        if (walletError) {
                                            res.status(500).json({
                                                data: walletError.message
                                            });
                                        } else {
                                            if (walletResults.length > 0) {
                                                res.status(400).json({
                                                    data: "There is already a wallet for this user"
                                                });
                                            } else {
                                                //create wallet
                                                const createWallet = `INSERT INTO wallets(user_id) VALUES ('${result.insertId}')`;
                                                db.query(createWallet, (createError, createResult) => {
                                                    if (createError) {
                                                        res.status(500).json({
                                                            data: createError.message
                                                        })
                                                    } else {
                                                        if (createResult) {
                                                            const createDemoWallet = `INSERT INTO demo_wallets(user_id) VALUES ('${result.insertId}')`;
                                                            db.query(createDemoWallet, (demoError, demoResult) => {
                                                                if (demoError) {
                                                                    res.status(500).json({
                                                                        data: demoError.message
                                                                    })
                                                                } else {
                                                                    if (demoResult) {
                                                                        // login and generate token for user
                                                                        const loginUser = `SELECT * FROM users WHERE id = '${result.insertId}'`;
                                                                        db.query(loginUser, (loginError, loginResult) => {
                                                                            if (loginError) {
                                                                                res.status(500).json({
                                                                                    data: loginError.message
                                                                                })
                                                                            } else {
                                                                                if (loginResult) {
                                                                                    const createAvatar = `INSERT INTO user_avatars (user_id) VALUES ('${loginResult[0].id}')`;
                                                                                    db.query(createAvatar);
                                                                                    //generate token
                                                                                    const token = jwt.sign({
                                                                                        id: loginResult[0].id,
                                                                                        firstname: loginResult[0].firstname,
                                                                                        lastname: loginResult[0].lastname,
                                                                                        email: loginResult[0].email,
                                                                                        phone: loginResult[0].phone,
                                                                                        country: loginResult[0].country,
                                                                                        referral_code: loginResult[0].referral_code
                                                                                    }, process.env.TOKEN_SECRET);

                                                                                    res.status(200).json({
                                                                                        ACCESS_TOKEN: token
                                                                                    })
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                            
                                                            
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    });
                                    
                                }
                            }
                        });

                    }
                }
            });
        } 
    }
}

const verifyEmail = (req, res) => {
    const verifyEmail = `SELECT * FROM users WHERE email = '${req.body.email}'`;

    db.query(verifyEmail, (error, result) => {
        if (error) {
            res.status(500).json({
                data: "An error occured " + error.message
            })
        } else {
            if (result.length < 1) {
                res.status(400).json({
                    data: "Invalid email"
                })
            } else {
                res.status(200).json({
                    data: "Email verified"
                })
            }
        }
    })
}

const resetPassword = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            data: "Fields cannot be empty"
        })
    } else {
        const changePassword = `UPDATE users SET password = '${password}' WHERE email = '${email}'`;
        db.query(changePassword, (error, result) => {
            if (error) {
                res.status(500).json({
                    data: "An error occured " + error.message
                })
            } else {
                if (result) {
                    res.status(200).json({
                        data: "Password updated successfully"
                    })
                }
            }
        })
    }
    
}

// @desc Login an existing user
// route POST /user/register
// @access Public
const loginUser = (req, res) => {
    const { email, password} = req.body;

    //check if all field are filled
    if (!email || !password) {
        res.status(400).json({
            data: "Fields cannot be empty"
        });
    } else {
        //check if email is valid
        if (!validate(email.toLowerCase())) {
            res.status(400).json({
                data: "Invalid email address"
            })
        } else {
            //check if user exists
            const checkUser = `SELECT * FROM users WHERE email = '${email}'`;
            db.query(checkUser, (checkError, checkResults) => {
                if (checkError) {
                    res.status(500).json({
                        data: checkError.message
                    })
                } else {
                    if (checkResults.length < 1) {
                        res.status(400).json({
                            data: "No user with this email"
                        })
                    } else {
                        if (checkResults[0].password !== password) {
                            res.status(400).json({
                                data: "Incorrect password"
                            })
                        } else {
                            //login user
                            const token = jwt.sign({
                                id: checkResults[0].id,
                                firstname: checkResults[0].firstname,
                                lastname: checkResults[0].lastname,
                                email: checkResults[0].email,
                                phone: checkResults[0].phone,
                                country: checkResults[0].country,
                                referral_code: checkResults[0].referral_code
                            }, process.env.TOKEN_SECRET);
            
                            res.status(200).json({
                                ACCESS_TOKEN: token
                            })
                        }
                    }
                }
            });
        }
    }
}

// @desc Gets current logged in user using user token
// route GET /user
// @access Private
const currentUser = (req, res) => {
    res.status(200).json(req.user)
}

// @desc Gets current logged in user copy trade status
// route GET /user/copy/status
// @access Private
const getCopyStatus = (req, res) => {

    const userId = req.user.id;

    const getCopyStatus = `SELECT * FROM users WHERE id='${userId}'`;
    
    db.query(getCopyStatus, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            if (!results[0].copy_trade) {
                res.status(400).json({
                    message: "Not active"
                })
            } else {
                // get trader INFO
                const gerTraderInfo = `SELECT * FROM traders WHERE id = '${results[0].copy_trade}'`;
                db.query(gerTraderInfo, (getError, getResults) => {
                    if (getError) {
                        res.status(500).json({
                            message: getError.message
                        })
                    } else {
                        if (getResults.length < 1) {
                            res.status(400).json({
                                message: "Invalid trader"
                            })
                        } else {
                            res.status(200).json(getResults[0])
                        }
                        
                    }
                })
            }
        }
    })
}


// @desc Gets current logged in user copy trade status
// route GET /user/copy/bar
// @access Private
const getStatusBar = (req, res) => {

    const userId = req.user.id;

    const getCopyStatus = `SELECT * FROM users WHERE id='${userId}'`;
    
    db.query(getCopyStatus, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            res.status(200).json(results[0].bar)
        }
    })
}

// @desc Update user password
// route POST /user/password
// @access Private
const updatePassword = (req, res) => {
    const id = req.user.id;

    const password = req.body.password;

    const updatePassword = `UPDATE users SET password = '${password}' WHERE id = '${id}'`;
    db.query(updatePassword, (error, result) => {
        if (error) {
            res.status(500).json({
                data: error.message
            })
        } else {
            if (result) {
                res.status(200).json({
                    data: "Password updated"
                });
            }
        }
    })
}


// @desc Get total referrals
// route GET user/referrals
// @access Public
const getReferrals = (req, res) => {
    const code = req.params.code;

    const getReferrals = `SELECT * FROM users WHERE referred_by = '${code}'`;

    db.query(getReferrals, (error, result) => {
        if (error) {
            res.status(500).json({
                data: error.message
            })
        } else {
            if (result) {
                res.status(200).json({
                    data: result.length
                })
            }
        }
    })
}

// @desc Get all users
// route GET user/all
// @access Public
const getAllUsers = (req, res) => {
    const getAllUsers = `SELECT * FROM users`;

    db.query(getAllUsers, (error, result) => {
        if (error) {
            res.status(500).json({
                data: error.message
            })
        } else {
            if (result) {
                res.status(200).json(result)
            }
        }
    })
}

const getAvatar = (req, res) => {
    const id = req.user.id;

    const getAvatar = `SELECT * FROM user_avatars WHERE user_id = '${id}'`;
    db.query(getAvatar, (error, result) => {
        if (error) {
            res.status(500).json({
                data: "An error occured " + error.message
            })
        } else {
            res.status(200).json(result[0])
        }
    })
}

const updateAvatar = (req, res) => {

    const id = req.user.id;

    const avatar = req.files.avatar;

    if (!avatar) {
        res.status(400).json({
            data: "You must select a picture"
        })
    } else {
        cloudinary.v2.uploader.upload(avatar.tempFilePath, (fileError, fileResult) => {
            if (fileError) {
                res.status(500).json({
                    data: "An error occured while uploading QR code",
                })
            } else {
                if (fileResult) {
                    const updateAvatar = `UPDATE user_avatars SET avatars = '${fileResult.secure_url}' WHERE user_id = '${id}'`;

                    db.query(updateAvatar, (addError, addResult) => {
                        if (addError) {
                            res.status(500).json({
                                data: "An error occured " + addError.message,
                            })
                        } else {
                            if (addResult) {
                                res.status(200).json({
                                    data: "Profile picture updated"
                                })
                            }
                        }
                    })
                }
            }
        })
    }
}


// @desc Get user by ID
// route GET user/:id
// @access Public
const getUser = (req, res) => {
    const getUser = `SELECT * FROM users WHERE id = '${req.params.id}'`;

    db.query(getUser, (error, result) => {
        if (error) {
            res.status(500).json({
                data: error.message
            })
        } else {
            if (result) {
                res.status(200).json(result[0])
            }
        }
    })
}

const deleteUser = (req, res) => {

    const { id } = req.body;

    if (!id) {
        res.status(400).json({data: "ID must be provided"})
    } else {
        const getUser = `DELETE FROM users WHERE id = '${id}'`;

        db.query(getUser, (error, result) => {
            if (error) {
                res.status(500).json({
                    data: error.message
                })
            } else {
                if (result) {
                    res.status(200).json(result)
                }
            }
        })
    }

    
}

const updateBalance = (req, res) => {

    const capital = req.body.capital;
    const id = req.params.id;

    if (!capital) {
        res.status(400).json({
            data: "Fields cannot be empty"
        })
    } else {
        const getUser = `UPDATE wallets SET balance = '${capital}' WHERE user_id = '${id}'`;

        db.query(getUser, (error, result) => {
            if (error) {
                res.status(500).json({
                    data: error.message
                })
            } else {
                if (result) {
                    res.status(200).json(result[0])
                }
            }
        })
    }

    
}

const updateProfit = (req, res) => {

    const profit = req.body.profit;
    const id = req.params.id;

    if (!profit) {
        res.status(400).json({
            data: "Fields cannot be empty"
        })
    } else {
        const getUser = `UPDATE wallets SET profit = '${profit}' WHERE user_id = '${id}'`;

        db.query(getUser, (error, result) => {
            if (error) {
                res.status(500).json({
                    data: error.message
                })
            } else {
                if (result) {
                    res.status(200).json(result[0])
                }
            }
        })
    }

    
}

const updateLoss = (req, res) => {

    const loss = req.body.loss;
    const id = req.params.id;

    if (!loss) {
        res.status(400).json({
            data: "Fields cannot be empty"
        })
    } else {
       const getUser = `UPDATE wallets SET loss = '${loss}' WHERE user_id = '${id}'`;

        db.query(getUser, (error, result) => {
            if (error) {
                res.status(500).json({
                    data: error.message
                })
            } else {
                if (result) {
                    res.status(200).json(result[0])
                }
            }
        }) 
    }

    
}

const updateStatusBar = (req, res) => {

    const bar = req.body.bar;
    const id = req.params.id;

    const getUser = `UPDATE users SET bar = '${bar}' WHERE id = '${id}'`;

    db.query(getUser, (error, result) => {
        if (error) {
            res.status(500).json({
                data: error.message
            })
        } else {
            if (result) {
                res.status(200).json(result[0])
            }
        }
    })
}




export { 
    registerUser, 
    loginUser, 
    currentUser,
    getCopyStatus,
    getStatusBar,
    updatePassword,
    getReferrals,
    getAllUsers,
    getUser,
    updateBalance,
    updateProfit,
    updateLoss,
    updateStatusBar,
    getAvatar,
    updateAvatar,
    deleteUser,
    verifyEmail,
    resetPassword
}