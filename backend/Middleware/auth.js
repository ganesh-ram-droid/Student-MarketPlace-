import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()
export const auth = (req,res,next)=>{
    const authHeader = req.header("Authorization")
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader
    if (!token) return res.status(401).json({ msg: "No token" });
    try{
        const decoded = jwt.verify(token  , process.env.JWT_SECRET)
        req.user=decoded
        next()
    }
     catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
}
