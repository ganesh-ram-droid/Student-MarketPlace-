/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import ProductCard from "../Components/ProductCard";
import { useAuth } from "../Context/AuthContextCore";
import { categories } from "../data/categories";
import { API_URL } from "../config/api";
import {
  Package,
  IndianRupee,
  Phone,
  Image as ImageIcon,
  Pencil
} from "lucide-react";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const { token } = useAuth();

  const loadMyProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/products/my-products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }

      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    loadMyProducts();
  }, [loadMyProducts]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setEditingProduct({
      ...editingProduct,
      [e.target.name]: value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/products/update/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(editingProduct)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }

      alert("Product Updated Successfully");
      setEditingProduct(null);
      loadMyProducts();

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/products/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }

      alert("Product Deleted Successfully");
      loadMyProducts();

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const response = await fetch(`${API_URL}/products/update/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          isAvailable: product.isAvailable === false
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }

      loadMyProducts();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">

      {/* Hero */}
      <div className="bg-black text-white px-4 sm:px-8 md:px-20 py-10 sm:py-14 rounded-b-[2rem] sm:rounded-b-[3rem] shadow-2xl">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-400 font-semibold uppercase tracking-wide mb-3">
            Student Marketplace
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
            Manage Your
            <span className="block text-green-400">
              Listed Products
            </span>
          </h1>

          <p className="mt-5 text-gray-300 text-base sm:text-lg max-w-2xl">
            Edit, update or remove your marketplace listings anytime.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              My Listings
            </h2>
            <p className="text-gray-500 mt-1">
              Products you have published
            </p>
          </div>

          <div className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold w-fit">
            {products.length} Products
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {editingProduct && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-10">
          <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <Pencil className="text-green-500" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Edit Product
              </h2>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">

              <div className="relative">
                <Package
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="title"
                  value={editingProduct.title}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <textarea
                name="description"
                value={editingProduct.description}
                onChange={handleChange}
                rows="5"
                required
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="grid md:grid-cols-2 gap-5">
                <div className="relative">
                  <IndianRupee
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <select
                  name="category"
                  value={editingProduct.category}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <ImageIcon
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="image"
                  value={editingProduct.image}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="relative">
                <Phone
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  name="mobile"
                  value={editingProduct.mobile || ""}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <label className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
                <span>
                  <span className="block font-semibold text-gray-900">
                    Product Available
                  </span>
                  <span className="text-sm text-gray-500">
                    Turn this off when the product is sold.
                  </span>
                </span>

                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={editingProduct.isAvailable !== false}
                  onChange={handleChange}
                  className="h-5 w-5 accent-green-600"
                />
              </label>

              <div className="grid md:grid-cols-2 gap-5">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition"
                >
                  Update Product
                </button>

                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="border border-gray-300 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg px-6 py-16 sm:py-20 text-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">
              No Products Added Yet
            </h3>
            <p className="text-gray-500 mt-3">
              Start selling your campus products today.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                showActions={true}
                onEdit={setEditingProduct}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
