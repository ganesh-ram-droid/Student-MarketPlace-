import express from 'express';
import { auth } from "../Middleware/auth.js";
import { signup,login,getMyProfile,getWishlist,toggleWishlist } from '../Controller/userController.js';
const router = express.Router()
router.post('/signup',signup)
router.post('/login',login)
router.get('/me', auth, getMyProfile)
router.get('/wishlist', auth, getWishlist)
router.post('/wishlist/:productId', auth, toggleWishlist)
export default router
