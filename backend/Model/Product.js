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

    image: {
      type: String,
      required: true
    },

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
