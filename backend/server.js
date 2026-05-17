import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import router from "./Routes/userRoutes.js";
import User from "./Model/User.js";
import productrouter from "./Routes/productRouter.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    const email = "admin@nec.com";

    const userExist = await User.findOne({ email });
    if (userExist) {
            console.log("Admin Aldready Exist");
            
          return;

    }
      

    const password = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email,
      password,
      role: "admin"
    });

    console.log("Admin Created");
  } catch (err) {
    console.log(err);
  }
};

await connectDB();
await seedAdmin();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", router);
app.use("/products",productrouter)

app.listen(process.env.PORT, () => {
  console.log(`Server Running On ${process.env.PORT}`);
});