import User from "../Model/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
export const signup =async (req,res)=>{
    try{
        const {name,email,password,role} = req.body
        const userExist =await User.findOne({email})
        if(userExist)
        {
           return  res.status(400).json({msg:"User Aldready Exist"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user  = await User.create({
            name,email,password:hashedPassword,role:role || "user"
        })
        const { password: _, ...safeUser } = user._doc;
           return res.status(201).json({   
      msg: "User Registered",
      user: safeUser
    });

    }
    catch(err){
       return res.status(400).json({error:err.message})
    }
}

export const login =async(req,res)=>{
    try{
        const {email,password}=req.body
    const userExist =await User.findOne({email})
        if(!userExist)
        {
            return res.status(400).json({msg:"Invalid Email"})
        }

        const isMatch =await bcrypt.compare(password,userExist.password)
        if(!isMatch)
        {
            return res.status(400).json({ msg: "Invalid Password" });

        }
        const token = jwt.sign(
            {id:userExist._id,role:userExist.role},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}

        )
        const { password: _, ...safeUser } = userExist._doc;
       return  res.status(200).json({
      msg: "Login Successful",
      token,
      user: safeUser
    });

    }
    catch(err)
    {
        return res.status(500).json({error:err.message})
    }
    

}
