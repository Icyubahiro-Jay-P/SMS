const StockTransaction = require("../models/StockTransaction");
const Product = require("../models/Product");

// Create Transaction (INSERT) - Also updates product stock
exports.createTransaction = async (req, res) => {
  try {
    const {
      quantityMoved,
      transactionType,
      productCode,
      warehouseCode,
      notes,
    } = req.body;

    if (!quantityMoved || !transactionType || !productCode || !warehouseCode) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!["IN", "OUT"].includes(transactionType)) {
      return res.status(400).json({
        success: false,
        message: "Transaction type must be IN or OUT",
      });
    }

    // Update product quantity
    const product = await Product.findById(productCode);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (transactionType === "OUT" && product.quantityInStock < quantityMoved) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // Update stock
    if (transactionType === "IN") {
      product.quantityInStock += quantityMoved;
    } else {
      product.quantityInStock -= quantityMoved;
    }
    await product.save();

    // Create transaction record
    const transaction = await StockTransaction.create({
      quantityMoved,
      transactionType,
      productCode,
      warehouseCode,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await StockTransaction.find()
      .populate("productCode", "productCode productName unitPrice")
      .populate("warehouseCode", "warehouseCode warehouseName")
      .sort({ transactionDate: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Transaction
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await StockTransaction.findById(req.params.id)
      .populate("productCode", "productCode productName unitPrice")
      .populate("warehouseCode", "warehouseCode warehouseName");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Transactions by Product
exports.getTransactionsByProduct = async (req, res) => {
  try {
    const transactions = await StockTransaction.find({
      productCode: req.params.productId,
    })
      .populate("productCode", "productCode productName unitPrice")
      .populate("warehouseCode", "warehouseCode warehouseName")
      .sort({ transactionDate: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Transactions by Warehouse
exports.getTransactionsByWarehouse = async (req, res) => {
  try {
    const transactions = await StockTransaction.find({
      warehouseCode: req.params.warehouseId,
    })
      .populate("productCode", "productCode productName unitPrice")
      .populate("warehouseCode", "warehouseCode warehouseName")
      .sort({ transactionDate: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Transactions by Date Range
exports.getTransactionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide startDate and endDate",
      });
    }

    const transactions = await StockTransaction.find({
      transactionDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate("productCode", "productCode productName unitPrice")
      .populate("warehouseCode", "warehouseCode warehouseName")
      .sort({ transactionDate: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Transaction
exports.updateTransaction = async (req, res) => {
  try {
    const {
      quantityMoved,
      transactionType,
      productCode,
      warehouseCode,
      notes,
    } = req.body;

    const transaction = await StockTransaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Revert old transaction effect on product
    const product = await Product.findById(transaction.productCode);
    if (transaction.transactionType === "IN") {
      product.quantityInStock -= transaction.quantityMoved;
    } else {
      product.quantityInStock += transaction.quantityMoved;
    }

    // Apply new transaction effect
    if (transactionType === "IN") {
      product.quantityInStock += quantityMoved;
    } else {
      product.quantityInStock -= quantityMoved;
    }

    if (product.quantityInStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock for this update",
      });
    }

    await product.save();

    // Update transaction
    if (quantityMoved) transaction.quantityMoved = quantityMoved;
    if (transactionType) transaction.transactionType = transactionType;
    if (productCode) transaction.productCode = productCode;
    if (warehouseCode) transaction.warehouseCode = warehouseCode;
    if (notes) transaction.notes = notes;

    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await StockTransaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Revert transaction effect on product
    const product = await Product.findById(transaction.productCode);
    if (transaction.transactionType === "IN") {
      product.quantityInStock -= transaction.quantityMoved;
    } else {
      product.quantityInStock += transaction.quantityMoved;
    }
    await product.save();

    await StockTransaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
