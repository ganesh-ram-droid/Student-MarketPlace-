import fs from "fs";
import path from "path";
import multer from "multer";

const uploadsRoot = path.resolve("uploads");
const productUploadDir = path.join(uploadsRoot, "products");

fs.mkdirSync(productUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, productUploadDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/-+/g, "-");

    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
});

export const productUploadsPath = productUploadDir;
