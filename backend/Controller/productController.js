import Product from "../Model/Product.js";
import fs from "fs/promises";
import path from "path";
import { productUploadsPath } from "../config/upload.js";

const isUploadedImageUrl = (value) => {
  return typeof value === "string" && value.includes("/uploads/products/");
};

const toArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch (err) {}

    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [String(value).trim()].filter(Boolean);
};

const buildFileUrl = (req, file) => {
  return `${req.protocol}://${req.get("host")}/uploads/products/${file.filename}`;
};

const extractImageSources = (req) => {
  const uploadedFiles = (req.files || []).map((file) =>
    buildFileUrl(req, file)
  );

  const bodyLinks = toArray(
    req.body.images || req.body.imageUrls || req.body.image
  );

  return [...uploadedFiles, ...bodyLinks].filter(Boolean);
};

const deleteUploadedFile = async (imageUrl) => {
  if (!isUploadedImageUrl(imageUrl)) return;

  const fileName = path.basename(imageUrl);
  const filePath = path.join(productUploadsPath, fileName);

  try {
    await fs.unlink(filePath);
  } catch (err) {}
};

const deleteUploadedFiles = async (images = []) => {
  for (const image of images) {
    await deleteUploadedFile(image);
  }
};

export const addProduct = async (req, res) => {
  try {
    const { title, description, price, category, mobile } = req.body;

    const imagesArr = extractImageSources(req);

    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !mobile ||
      imagesArr.length === 0
    ) {
      return res.status(400).json({
        msg: "All fields are required and at least one image is required"
      });
    }

    if (imagesArr.length > 5) {
      return res.status(400).json({
        msg: "Maximum 5 images allowed"
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      mobile,
      seller: req.user.id,
      image: imagesArr[0],
      images: imagesArr
    });

    return res.status(201).json({
      msg: "Product added successfully",
      product
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const products = await Product.find({
      isAvailable: true
    })
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProducts = await Product.countDocuments({
      isAvailable: true
    });

    return res.status(200).json({
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email"
    );

    if (!product) {
      return res.status(404).json({
        msg: "Product not found"
      });
    }

    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { title, description, price, category, mobile, isAvailable } =
      req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        msg: "Product not found"
      });
    }

    if (
      product.seller.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        msg: "Unauthorized"
      });
    }

    const updates = {};

    const newImages = extractImageSources(req);

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (category !== undefined) updates.category = category;
    if (mobile !== undefined) updates.mobile = mobile;
    if (isAvailable !== undefined) updates.isAvailable = isAvailable;

    if (newImages.length > 0) {
      if (newImages.length > 5) {
        return res.status(400).json({
          msg: "Maximum 5 images allowed"
        });
      }

      updates.image = newImages[0];
      updates.images = newImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (newImages.length > 0) {
      await deleteUploadedFiles(product.images || []);
    }

    return res.status(200).json({
      msg: "Product updated successfully",
      updatedProduct
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        msg: "Product not found"
      });
    }

    if (
      product.seller.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        msg: "Unauthorized"
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    await deleteUploadedFiles(product.images || []);

    return res.status(200).json({
      msg: "Product deleted successfully"
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user.id
    }).sort({
      createdAt: -1
    });

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

export const reportProduct = async (req, res) => {
  try {
    const { reason } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        msg: "Product not found"
      });
    }

    const alreadyReported = product.reports.find(
      (report) => report.reporter.toString() === req.user.id
    );

    if (alreadyReported) {
      return res.status(400).json({
        msg: "You have already reported this product"
      });
    }

    product.reports.push({
      reporter: req.user.id,
      reason: reason || "",
      createdAt: new Date()
    });

    await product.save();

    return res.status(200).json({
      msg: "Report submitted successfully"
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

export const getReportedProducts = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        msg: "Unauthorized"
      });
    }

    const products = await Product.find({
      "reports.0": {
        $exists: true
      }
    })
      .populate("seller", "name email")
      .populate("reports.reporter", "name email")
      .sort({
        updatedAt: -1
      });

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const query = req.query.query || "";

    const products = await Product.find({
      $or: [
        {
          title: {
            $regex: query,
            $options: "i"
          }
        },
        {
          description: {
            $regex: query,
            $options: "i"
          }
        }
      ],
      isAvailable: true
    })
      .populate("seller", "name email")
      .sort({
        createdAt: -1
      });

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

export const filterByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      isAvailable: true
    })
      .populate("seller", "name email")
      .sort({
        createdAt: -1
      });

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};