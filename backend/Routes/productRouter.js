import { Router } from "express";
import { auth } from "../Middleware/auth.js";
import { upload } from "../config/upload.js";
import { addProduct, deleteProduct, filterByCategory, getAllProducts, getMyProducts, getSingleProduct, searchProducts, updateProduct, reportProduct, getReportedProducts } from "../Controller/productController.js";
const productrouter = Router()
productrouter.post("/add", auth, upload.array("images", 6), addProduct);
productrouter.get("/all", getAllProducts);
productrouter.get("/my-products", auth, getMyProducts);
productrouter.get("/search", searchProducts);
productrouter.get("/category/:category", filterByCategory);
productrouter.get("/:id", getSingleProduct);
productrouter.put("/update/:id", auth, upload.array("images", 6), updateProduct);
productrouter.delete("/delete/:id", auth, deleteProduct);
// Reporting
productrouter.post("/:id/report", auth, reportProduct);
productrouter.get("/reported/all", auth, getReportedProducts);
export default productrouter
