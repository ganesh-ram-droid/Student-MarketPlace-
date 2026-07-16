import User from "../Model/User.js";
import AllowedDomain from "../Model/AllowedDomain.js";
import Product from "../Model/Product.js";
import SellerReview from "../Model/SellerReview.js";

export const getDashboardAnalytics = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: "user" });

    const productCount = await Product.countDocuments();

    const reportedCount = await Product.countDocuments({
      "reports.0": { $exists: true }
    });

    const blockedCount = await User.countDocuments({
      isBlocked: true
    });

    const reviewCount = await SellerReview.countDocuments();

    const totalWishlistEntries = await User.aggregate([
      {
        $project: {
          count: {
            $size: {
              $ifNull: ["$wishlist", []]
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$count"
          }
        }
      }
    ]);

    const domains = await AllowedDomain.find().sort({
      createdAt: -1
    });

    const activeDomainCount = await AllowedDomain.countDocuments({
      isActive: true
    });

    res.status(200).json({
      stats: {
        userCount,
        productCount,
        reportedCount,
        blockedCount,
        reviewCount,
        totalWishlistEntries: totalWishlistEntries[0]?.total || 0,
        activeDomainCount
      },
      domains
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};