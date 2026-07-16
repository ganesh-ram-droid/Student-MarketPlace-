import Product from "../Model/Product.js";
import SellerReview from "../Model/SellerReview.js";

export const addSellerReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (product.seller.toString() === req.user.id) {
      return res.status(400).json({ msg: "You cannot review yourself" });
    }

    const review = await SellerReview.create({
      seller: product.seller,
      reviewer: req.user.id,
      product: product._id,
      rating: Number(rating),
      comment: comment || ""
    });

    return res.status(201).json({ msg: "Review added", review });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ msg: "You already reviewed this seller for this product" });
    }
    return res.status(500).json({ error: err.message });
  }
};

export const getSellerReviews = async (req, res) => {
  try {
    const reviews = await SellerReview.find({ seller: req.params.sellerId })
      .populate("reviewer", "name email")
      .populate("product", "title image images");

    const total = reviews.length;
    const averageRating = total
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
      : 0;

    return res.status(200).json({
      reviews,
      total,
      averageRating: Number(averageRating.toFixed(1))
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
