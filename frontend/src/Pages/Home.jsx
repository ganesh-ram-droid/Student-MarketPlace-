/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";
import { API_URL } from "../config/api";
import { CheckCircle2, Heart, Search, XCircle } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [wishlist, setWishlist] = useState(new Set());
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const LoadProducts = useCallback(async () => {
    try {
      let url = `${API_URL}/products/all`;

      if (search) {
        url = `${API_URL}/products/search?query=${encodeURIComponent(search)}`;
      }

      if (category) {
        url = `${API_URL}/products/category/${encodeURIComponent(category)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }

      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  }, [search, category]);

  useEffect(() => {
    LoadProducts();
  }, [LoadProducts]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/user/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (!response.ok) return;

        setWishlist(new Set(data.map((item) => item._id)));
      } catch (error) {
        console.log(error);
      }
    };

    loadWishlist();
  }, [token]);

  const toggleWishlist = async (productId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/wishlist/${productId}`, {
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

      setWishlist((prev) => {
        const next = new Set(prev);
        if (data.inWishlist) {
          next.add(productId);
        } else {
          next.delete(productId);
        }
        return next;
      });
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      
      {/* Hero Section */}
      <div className="bg-black text-white px-4 sm:px-8 md:px-20 py-10 sm:py-16 rounded-b-[2rem] sm:rounded-b-[3rem] shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <p className="text-green-400 font-semibold tracking-wide uppercase mb-3">
            Student Marketplace
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
            Buy, Sell & Exchange
            <span className="block text-green-400">
              Campus Essentials
            </span>
          </h1>

          <p className="mt-5 text-gray-300 text-base sm:text-lg max-w-2xl">
            Books, electronics, notes, hostel items, cycles and more —
            everything students need in one marketplace.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-4 sm:gap-5 items-center">

            <div className="relative md:col-span-2">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCategory("");
                }}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSearch("");
              }}
              className="px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Available Products
            </h2>
            <p className="text-gray-500 mt-2">
              Discover the best deals from your campus.
            </p>
          </div>

          <div className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold w-fit">
            {products.length} Products
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg px-6 py-16 sm:py-20 text-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">
              No Products Available
            </h3>
            <p className="text-gray-500 mt-3">
              Try searching another category.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => {
              const isAvailable = product.isAvailable !== false;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
                >
                  <div className="relative">
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className="absolute right-3 top-3 z-10 rounded-full bg-white/95 p-2 shadow-md hover:scale-105 transition"
                      aria-label="Save product"
                    >
                      <Heart
                        size={18}
                        className={wishlist.has(product._id) ? "fill-red-500 text-red-500" : "text-gray-500"}
                      />
                    </button>

                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.title}
                      className="w-full h-48 sm:h-56 object-cover"
                    />

                    <span
                      className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isAvailable ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {isAvailable ? "Available" : "Sold"}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 break-words">
                      {product.title}
                    </h2>

                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {product.description}
                    </p>

                    <p className="text-lg font-semibold text-blue-600 mt-3">
                      Rs. {product.price}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      Category: {product.category}
                    </p>

                    {product.seller?.name && (
                      <p className="text-sm text-gray-500">
                        Seller: {product.seller.name}
                      </p>
                    )}

                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
