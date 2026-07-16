import User from "../Model/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import AllowedDomain from "../Model/AllowedDomain.js"
dotenv.config()
const getDomainFromEmail = (email) => email.split("@").pop()?.toLowerCase();
export const signup =async (req,res)=>{
    try{
        const {name,email,password} = req.body
        if(!name || !email || !password){
            return res.status(400).json({msg:"Name, email and password are required"})
        }

        const domain = getDomainFromEmail(email);
        const domainAllowed = await AllowedDomain.findOne({ domain, isActive: true });
        if (!domainAllowed) {
            return res.status(403).json({
                msg: "Your college email domain is not allowed yet. Ask the admin to approve it."
            });
        }

        const userExist =await User.findOne({email})
        if(userExist)
        {
           return  res.status(400).json({msg:"User Aldready Exist"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user  = await User.create({
            name,
            email,
            password:hashedPassword,
            role:"user"
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
        if(!email || !password){
            return res.status(400).json({msg:"Email and password are required"})
        }
    const userExist =await User.findOne({email})
        if(!userExist)
        {
            return res.status(400).json({msg:"Invalid Email"})
        }

        if (userExist.isBlocked) {
            return res.status(403).json({ msg: "Your account has been blocked by the admin" });
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

export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password").populate("wishlist");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: "wishlist",
            populate: { path: "seller", select: "name email" }
        }).select("wishlist");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json(user.wishlist || []);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const hasItem = user.wishlist.some((item) => item.toString() === productId);
        if (hasItem) {
            user.wishlist = user.wishlist.filter((item) => item.toString() !== productId);
        } else {
            user.wishlist.push(productId);
        }

        await user.save();

        return res.status(200).json({
            msg: hasItem ? "Removed from wishlist" : "Added to wishlist",
            inWishlist: !hasItem,
            wishlist: user.wishlist
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
