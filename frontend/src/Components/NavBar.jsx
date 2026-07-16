
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContextCore";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-md px-4 sm:px-8 py-4 md:flex md:items-center md:justify-between">
      <div className="flex justify-between items-center md:block">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl sm:text-2xl font-bold text-emerald-600"
        >
          DigitalCollege
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="md:hidden rounded-lg border border-gray-200 p-2 text-gray-700"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } mt-4 flex-col gap-4 md:mt-0 md:flex md:flex-row md:items-center md:justify-end md:gap-6`}
      >
        <Link
          to="/"
          onClick={closeMenu}
          className="text-gray-700 hover:text-emerald-600"
        >
          Home
        </Link>

        {isAuthenticated && (
          <>
            <Link
              to="/addproduct"
              onClick={closeMenu}
              className="text-gray-700 hover:text-emerald-600"
            >
              Add Product
            </Link>
            <Link
              to="/myproducts"
              onClick={closeMenu}
              className="text-gray-700 hover:text-emerald-600"
            >
              My Products
            </Link>
            <Link
              to="/wishlist"
              onClick={closeMenu}
              className="text-gray-700 hover:text-emerald-600"
            >
              Wishlist
            </Link>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={closeMenu}
                className="text-gray-700 hover:text-emerald-600"
              >
                Admin
              </Link>
            )}
          </>
        )}

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="w-full md:w-auto px-4 py-2 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>
              <button className="w-full md:w-auto px-4 py-2 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50">
                Login
              </button>
            </Link>

            <Link to="/signup" onClick={closeMenu}>
              <button className="w-full md:w-auto px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
                Signup
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
