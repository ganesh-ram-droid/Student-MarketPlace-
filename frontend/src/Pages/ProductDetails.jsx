/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config/api";
import {
  ArrowLeft,
  Heart,
  HeartOff,
  Mail,
  Phone,
  Tag,
  IndianRupee,
  MessageCircle,
  Star
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [sellerReviews, setSellerReviews] = useState({ reviews: [], averageRating: 0, total: 0 });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const loadProduct = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }

      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  const loadSellerReviews = useCallback(async (sellerId) => {
    try {
      const response = await fetch(`${API_URL}/reviews/seller/${sellerId}`);
      const data = await response.json();

      if (!response.ok) return;

      setSellerReviews(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const loadWishlistState = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/user/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (!response.ok) return;

      setIsWishlisted(data.some((item) => item._id === id));
    } catch (error) {
      console.log(error);
    }
  }, [id, token]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  useEffect(() => {
    if (product?.seller?._id) {
      loadSellerReviews(product.seller._id);
    }
  }, [product, loadSellerReviews]);

  useEffect(() => {
    loadWishlistState();
  }, [loadWishlistState]);

  const toggleWishlist = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/wishlist/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }

      setIsWishlisted(data.inWishlist);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoadingReview(true);
      const response = await fetch(`${API_URL}/reviews/product/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }

      setReviewForm({ rating: 5, comment: "" });
      loadSellerReviews(product.seller._id);
      alert("Review added");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoadingReview(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="bg-white px-10 py-6 rounded-3xl shadow-xl text-xl font-semibold text-gray-700">
          Loading Product...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <div className="bg-black text-white px-4 sm:px-8 md:px-20 py-10 sm:py-14 rounded-b-[2rem] sm:rounded-b-[3rem] shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-8"
          >
            <ArrowLeft size={20} />
            Back to Marketplace
          </Link>

          <p className="text-green-400 font-semibold uppercase tracking-wide mb-3">
            Product Details
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight break-words">
            {product.title}
          </h1>

          <p className="mt-5 text-gray-300 text-base sm:text-lg max-w-2xl">
            Explore complete product details and contact the seller instantly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 relative z-10 space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 gap-6 sm:gap-10 p-5 sm:p-8 md:p-10">
          <div>
            <img
              src={product.images?.[activeImage] || product.image}
              alt={product.title}
              className="w-full h-72 sm:h-96 lg:h-[550px] object-cover rounded-3xl"
            />
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-2xl border-2 ${
                      activeImage === index ? "border-green-500" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="h-24 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full w-fit font-semibold">
                <Tag size={18} />
                {product.category}
              </div>

              <div
                className={`px-4 py-2 rounded-full w-fit font-semibold ${
                  product.isAvailable !== false
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.isAvailable !== false ? "Available" : "Sold"}
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 break-words">
              {product.title}
            </h2>

            <p className="text-gray-600 mt-5 text-base sm:text-lg leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mt-8">
              <IndianRupee className="text-green-500" />
              <span className="text-3xl sm:text-4xl font-bold text-green-600">
                {product.price}
              </span>
            </div>

            <div className="mt-10 bg-gray-50 rounded-3xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                Seller Information
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-gray-700">
                <span className="font-semibold">Name:</span>
                <span>{product.seller?.name}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-gray-700 break-all">
                <Mail size={18} />
                <span>{product.seller?.email}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-gray-700">
                <Star size={18} className="text-amber-500" />
                <span className="font-semibold">
                  {sellerReviews.averageRating || 0}/5
                </span>
                <span className="text-sm text-gray-500">
                  from {sellerReviews.total || 0} reviews
                </span>
              </div>

              {product.mobile && (
                <div className="flex flex-wrap items-center gap-3 text-gray-700">
                  <Phone size={18} />
                  <span>{product.mobile}</span>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {product.mobile ? (
                <a
                  href={`https://wa.me/${product.mobile.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hi, I am interested in ${product.title}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition"
                >
                  <MessageCircle size={20} />
                  WhatsApp Seller
                </a>
              ) : product.seller?.email ? (
                <a
                  href={`mailto:${product.seller.email}?subject=Interested in ${product.title}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition"
                >
                  <Mail size={20} />
                  Email Seller
                </a>
              ) : null}

              <button
                onClick={toggleWishlist}
                className="inline-flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-800 py-4 px-5 rounded-2xl text-lg font-semibold shadow-sm hover:bg-gray-50 transition"
              >
                {isWishlisted ? <HeartOff size={20} /> : <Heart size={20} />}
                {isWishlisted ? "Saved" : "Save"}
              </button>

              <button
                onClick={async () => {
                  if (!token) {
                    navigate("/login");
                    return;
                  }

                  const reason = prompt(
                    "Please enter a reason for reporting this product:"
                  );
                  if (!reason) return;

                  try {
                    const res = await fetch(`${API_URL}/products/${id}/report`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                      },
                      body: JSON.stringify({ reason })
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      alert(data.msg || data.error);
                      return;
                    }
                    alert("Report submitted. Admin will review the product.");
                  } catch (err) {
                    console.error(err);
                    alert("Something went wrong");
                  }
                }}
                className="mt-3 sm:mt-0 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl text-lg font-semibold shadow-lg transition"
              >
                Report Product
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Rate the Seller</h3>

          <form onSubmit={submitReview} className="grid gap-4 md:grid-cols-[160px_1fr_auto]">
            <select
              value={reviewForm.rating}
              onChange={(e) =>
                setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))
              }
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>

            <input
              type="text"
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Write a short review..."
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loadingReview}
              className="px-5 py-3 rounded-2xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60"
            >
              {loadingReview ? "Saving..." : "Submit"}
            </button>
          </form>

          <div className="mt-8 grid gap-4">
            {(sellerReviews.reviews || []).length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              sellerReviews.reviews.map((review) => (
                <div key={review._id} className="rounded-2xl bg-gray-50 p-5">
                  <div className="flex items-center gap-2 text-amber-500 font-semibold">
                    <Star size={18} />
                    {review.rating}/5
                  </div>
                  <p className="mt-2 text-gray-700">{review.comment || "No comment provided"}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    By {review.reviewer?.name || "Anonymous"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
