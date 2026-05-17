/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../config/api";
import {
  ArrowLeft,
  Mail,
  Phone,
  Tag,
  IndianRupee,
  MessageCircle
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

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

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

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

      {/* Hero */}
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

      {/* Product Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 gap-6 sm:gap-10 p-5 sm:p-8 md:p-10">

          {/* Image */}
          <div>
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-72 sm:h-96 lg:h-[550px] object-cover rounded-3xl"
            />
          </div>

          {/* Details */}
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

            {/* Seller Info */}
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

              {product.mobile && (
                <div className="flex flex-wrap items-center gap-3 text-gray-700">
                  <Phone size={18} />
                  <span>{product.mobile}</span>
                </div>
              )}
            </div>

            {/* Actions */}
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
              ) : product.seller?.email && (
                <a
                  href={`mailto:${product.seller.email}?subject=Interested in ${product.title}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition"
                >
                  <Mail size={20} />
                  Email Seller
                </a>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
