/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import { Heart, Trash2 } from "lucide-react";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const loadWishlist = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }

      setItems(data);
    } catch (error) {
      console.log(error);
    }
  }, [navigate, token]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const removeItem = async (productId) => {
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
      loadWishlist();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <div className="bg-black text-white px-4 sm:px-8 md:px-20 py-10 sm:py-14 rounded-b-[2rem] sm:rounded-b-[3rem] shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <p className="text-green-400 font-semibold uppercase tracking-wide mb-3">
            Saved Items
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
            Your
            <span className="block text-green-400">Wishlist</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg px-6 py-16 sm:py-20 text-center">
            <Heart className="mx-auto text-gray-400" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mt-4">
              No saved items yet
            </h3>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={product.images?.[0] || product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h2 className="font-bold text-gray-900">{product.title}</h2>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => removeItem(product._id)}
                      className="inline-flex items-center justify-center rounded-xl bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
