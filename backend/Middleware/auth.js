import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import User from "../Model/User.js"
dotenv.config()
export const auth = async (req,res,next)=>{
    const authHeader = req.header("Authorization")
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader
    if (!token) return res.status(401).json({ msg: "No token" });
    try{
        const decoded = jwt.verify(token  , process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ msg: "Invalid token" });
        }
        if (user.isBlocked) {
            return res.status(403).json({ msg: "Your account has been blocked by the admin" });
        }
        req.user={
            id: user._id.toString(),
            role: user.role,
            email: user.email,
            name: user.name,
            isBlocked: user.isBlocked
        }
        next()
    }
     catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ msg: "Unauthorized" });
  }

  return next();
};
