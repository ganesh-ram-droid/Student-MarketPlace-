import { useNavigate } from "react-router-dom";
import { CheckCircle2, Pencil, Trash2, XCircle } from "lucide-react";

const ProductCard = ({
  product,
  showActions = false,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const navigate = useNavigate();
  const isAvailable = product.isAvailable !== false;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
      <div className="relative">
        <img
          src={product.image}
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
          {isAvailable ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
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

        {showActions && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <button
              onClick={() => onToggleStatus(product)}
              className={`sm:col-span-2 inline-flex items-center justify-center gap-2 py-2 rounded-xl text-white transition ${
                isAvailable
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isAvailable ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
              Mark as {isAvailable ? "Sold" : "Available"}
            </button>

            <button
              onClick={() => onEdit(product)}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition"
            >
              <Pencil size={18} />
              Edit
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="inline-flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
