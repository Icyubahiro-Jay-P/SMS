const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  warehouseCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  warehouseName: {
    type: String,
    required: true,
    trim: true,
  },
  warehouseLocation: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
warehouseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Warehouse", warehouseSchema);
