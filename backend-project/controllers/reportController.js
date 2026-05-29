const StockTransaction = require("../models/StockTransaction");

// Get Daily Report
exports.getDailyReport = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Please provide a date",
      });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const transactions = await StockTransaction.find({
      transactionDate: { $gte: startDate, $lte: endDate },
    })
      .populate(
        "productCode",
        "productCode productName unitPrice quantityInStock",
      )
      .populate("warehouseCode", "warehouseCode warehouseName");

    const stockIn = transactions.filter((t) => t.transactionType === "IN");
    const stockOut = transactions.filter((t) => t.transactionType === "OUT");

    const totalStockIn = stockIn.reduce((sum, t) => sum + t.quantityMoved, 0);
    const totalStockOut = stockOut.reduce((sum, t) => sum + t.quantityMoved, 0);

    res.status(200).json({
      success: true,
      report: {
        date,
        totalTransactions: transactions.length,
        stockInTransactions: stockIn.length,
        stockOutTransactions: stockOut.length,
        totalStockIn,
        totalStockOut,
        transactions,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Weekly Report
exports.getWeeklyReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide startDate and endDate",
      });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const transactions = await StockTransaction.find({
      transactionDate: { $gte: start, $lte: end },
    })
      .populate(
        "productCode",
        "productCode productName unitPrice quantityInStock",
      )
      .populate("warehouseCode", "warehouseCode warehouseName");

    const stockIn = transactions.filter((t) => t.transactionType === "IN");
    const stockOut = transactions.filter((t) => t.transactionType === "OUT");

    const totalStockIn = stockIn.reduce((sum, t) => sum + t.quantityMoved, 0);
    const totalStockOut = stockOut.reduce((sum, t) => sum + t.quantityMoved, 0);

    res.status(200).json({
      success: true,
      report: {
        startDate,
        endDate,
        totalTransactions: transactions.length,
        stockInTransactions: stockIn.length,
        stockOutTransactions: stockOut.length,
        totalStockIn,
        totalStockOut,
        transactions,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Monthly Report
exports.getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Please provide month and year",
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const transactions = await StockTransaction.find({
      transactionDate: { $gte: startDate, $lte: endDate },
    })
      .populate(
        "productCode",
        "productCode productName unitPrice quantityInStock",
      )
      .populate("warehouseCode", "warehouseCode warehouseName");

    const stockIn = transactions.filter((t) => t.transactionType === "IN");
    const stockOut = transactions.filter((t) => t.transactionType === "OUT");

    const totalStockIn = stockIn.reduce((sum, t) => sum + t.quantityMoved, 0);
    const totalStockOut = stockOut.reduce((sum, t) => sum + t.quantityMoved, 0);

    res.status(200).json({
      success: true,
      report: {
        month,
        year,
        totalTransactions: transactions.length,
        stockInTransactions: stockIn.length,
        stockOutTransactions: stockOut.length,
        totalStockIn,
        totalStockOut,
        transactions,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Available Stock Report
exports.getAvailableStockReport = async (req, res) => {
  try {
    const Product = require("../models/Product");

    const products = await Product.find();

    const totalValue = products.reduce(
      (sum, p) => sum + p.quantityInStock * p.unitPrice,
      0,
    );
    const totalQuantity = products.reduce(
      (sum, p) => sum + p.quantityInStock,
      0,
    );

    res.status(200).json({
      success: true,
      report: {
        totalProducts: products.length,
        totalQuantity,
        totalValue,
        products,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
