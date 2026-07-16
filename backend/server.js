import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import path from "path";
import connectDB from "./config/db.js";
import router from "./Routes/userRoutes.js";
import User from "./Model/User.js";
import productrouter from "./Routes/productRouter.js";
import adminrouter from "./Routes/adminRoutes.js";
import reviewrouter from "./Routes/reviewRoutes.js";

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
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/user", router);
app.use("/products",productrouter)
app.use("/admin", adminrouter);
app.use("/reviews", reviewrouter);

app.use((err, _req, res, _next) => {
  if (err?.message === "Only image files are allowed") {
    return res.status(400).json({ msg: err.message });
  }

  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ msg: "Each image must be 5MB or smaller" });
  }

  console.error(err);
  return res.status(500).json({ msg: "Internal server error" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server Running On ${process.env.PORT}`);
});
