import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Books",
        "Electronics",
        "Notes",
        "Cycles",
        "Hostel Items",
        "Lab Equipment"
      ]
    },

    // Keep single `image` for backward-compat but prefer `images` array
    image: {
      type: String
    },

    images: {
      type: [String],
      default: []
    },

    reports: [
      {
        reporter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        reason: String,
        createdAt: Date
      }
    ],

    mobile: {
      type: String,
      required: true,
      trim: true
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Product", productSchema);
