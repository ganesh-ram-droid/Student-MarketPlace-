import mongoose from "mongoose";

const sellerReviewSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

sellerReviewSchema.index({ seller: 1, reviewer: 1, product: 1 }, { unique: true });

export default mongoose.model("SellerReview", sellerReviewSchema);
