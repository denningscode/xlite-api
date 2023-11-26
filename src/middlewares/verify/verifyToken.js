import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    //check if authorization header is present
    const authorizationHeader = req.headers['authorization'];
    
    if (!authorizationHeader) {
        res.status(400).json({
            message: "Authorization header missing"
        })
    } else {
        //get token
        const token = authorizationHeader.split(" ")[1];

        if (!token) {
            res.status(400).json({
                message: "Access denied"
            })
        } else {
            //verify token and send user data to request
            jwt.verify(token, process.env.TOKEN_SECRET, (error, result) => {
                if (error) {
                    res.status(500).json({
                        message: error.message
                    })
                } else {
                    req.user = result;
                    next();
                }
            });
        }
        
    }
    
}

export default verifyToken;