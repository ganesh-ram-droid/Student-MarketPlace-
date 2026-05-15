import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import router from "./Routes/userRoutes.js"
console.log(dotenv.config());



connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/user',router)
app.listen(process.env.PORT,()=>{
    console.log(`Server Running On ${process.env.PORT}`);
    
})