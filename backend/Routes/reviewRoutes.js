import { Router } from "express";
import { auth } from "../Middleware/auth.js";
import { addSellerReview, getSellerReviews } from "../Controller/reviewController.js";

const router = Router();

router.get("/seller/:sellerId", getSellerReviews);
router.post("/product/:productId", auth, addSellerReview);

export default router;
