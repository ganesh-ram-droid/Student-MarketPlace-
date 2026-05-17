import Product from "../Model/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { title, description, price, category, image, mobile } = req.body;

    if (!title || !description || !price || !category || !image || !mobile) {
      return res.status(400).json({
        msg: "All fields are required"
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      image,
      mobile,
      seller: req.user.id
    });

    res.status(201).json({
      msg: "Product added successfully",
      product
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isAvailable: true
    }).populate("seller", "name email");

    res.status(200).json(products);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name email");

    if (!product) {
      return res.status(404).json({
        msg: "Product not found"
      });
    }

    res.status(200).json(product);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { title, description, price, category, image, mobile, isAvailable } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        msg: "Product not found"
      });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        msg: "Unauthorized"
      });
    }

    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (category !== undefined) updates.category = category;
    if (image !== undefined) updates.image = image;
    if (mobile !== undefined) updates.mobile = mobile;
    if (isAvailable !== undefined) updates.isAvailable = isAvailable;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      msg: "Product updated successfully",
      updatedProduct
    });

  } catch (err) {
    res.status(500).json({
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

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        msg: "Unauthorized"
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      msg: "Product deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user.id
    });

    res.status(200).json(products);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const query = req.query.query;

    const products = await Product.find({
      title: { $regex: query, $options: "i" },
      isAvailable: true
    }).populate("seller", "name email");

    res.status(200).json(products);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const filterByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      isAvailable: true
    }).populate("seller", "name email");

    res.status(200).json(products);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
