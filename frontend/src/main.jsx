
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Home from "./Pages/Home.jsx";
import Navbar from "./Components/NavBar.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import AddProduct from "./Pages/AddProduct.jsx";
import MyProducts from "./Pages/MyProducts.jsx";
import ProductDetails from "./Pages/ProductDetails.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import AdminReports from "./Pages/AdminReports.jsx";
import Wishlist from "./Pages/Wishlist.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/addproduct"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myproducts"
          element={
            <ProtectedRoute>
              <MyProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route path="/products/:id" element={<ProductDetails />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
