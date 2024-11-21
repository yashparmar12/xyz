import jwt from "jsonwebtoken";
import jwtKey from "../jwtKey.js"

const Authenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            res.status(400).json({
                message:"User not found",
                success:false
            })
        }

        const decode = jwt.verify(token, jwtKey);
        if(!decode){
            res.status(400).json({
                message:"Invalid token",
                success:false
            })
        }
        req.id = decode.userId;
        next(); //if sari chije properly work kre to go next route
    } catch (error) {
        console.log(error);
    }
}

export default Authenticated;