import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContextCore";
import { categories } from "../data/categories";
import { API_URL } from "../config/api";
import { Package, IndianRupee, Phone, Image as ImageIcon } from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    mobile: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/products/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }

      alert("Product Added Successfully");
      navigate("/home");

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
            Sell Your Product
            <span className="block text-green-400">
              To Your Campus
            </span>
          </h1>

          <p className="mt-5 text-gray-300 text-base sm:text-lg max-w-2xl">
            List your unused books, electronics, notes, cycles and hostel items
            for other students.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10">

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="relative">
              <Package
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="title"
                placeholder="Product Title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <textarea
              name="description"
              placeholder="Describe your product..."
              value={form.description}
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
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Category</option>
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
                placeholder="Image URL"
                value={form.image}
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
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition"
            >
              Publish Product
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
