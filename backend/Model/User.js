import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true },
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    wishlist:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    isBlocked:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    
},
   {timestamps:true}

)
export default mongoose.model("User",userSchema)
