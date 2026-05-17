/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import ProductCard from "../Components/ProductCard";
import { categories } from "../data/categories";
import { API_URL } from "../config/api";
import { Search } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

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
            {products.map((product) => (
              <ProductCard
                product={product}
                key={product._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
