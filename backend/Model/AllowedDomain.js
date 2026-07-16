import mongoose from "mongoose";

const allowedDomainSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    label: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("AllowedDomain", allowedDomainSchema);
