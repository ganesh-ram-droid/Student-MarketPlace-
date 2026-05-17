import { Router } from "express";
import { auth } from "../Middleware/auth.js";
import { addProduct, deleteProduct, filterByCategory, getAllProducts, getMyProducts, getSingleProduct, searchProducts, updateProduct } from "../Controller/productController.js";
const productrouter = Router()
productrouter.post("/add", auth, addProduct);
productrouter.get("/all", getAllProducts);
productrouter.get("/my-products", auth, getMyProducts);
productrouter.get("/search", searchProducts);
productrouter.get("/category/:category", filterByCategory);
productrouter.get("/:id", getSingleProduct);
productrouter.put("/update/:id", auth, updateProduct);
productrouter.delete("/delete/:id", auth, deleteProduct);
export default productrouter