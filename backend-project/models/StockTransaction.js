const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    default: function () {
      return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
  },
  transactionDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  quantityMoved: {
    type: Number,
    required: true,
    min: 1,
  },
  transactionType: {
    type: String,
    enum: ["IN", "OUT"],
    required: true,
  },
  productCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  warehouseCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
transactionSchema.index({ transactionDate: -1 });
transactionSchema.index({ productCode: 1 });
transactionSchema.index({ warehouseCode: 1 });

module.exports = mongoose.model("StockTransaction", transactionSchema);
