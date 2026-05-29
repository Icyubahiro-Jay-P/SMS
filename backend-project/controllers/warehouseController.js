const Warehouse = require("../models/Warehouse");

// Create Warehouse (INSERT)
exports.createWarehouse = async (req, res) => {
  try {
    const { warehouseCode, warehouseName, warehouseLocation } = req.body;

    if (!warehouseCode || !warehouseName || !warehouseLocation) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const warehouse = await Warehouse.create({
      warehouseCode,
      warehouseName,
      warehouseLocation,
    });

    res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      warehouse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Warehouses
exports.getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: warehouses.length,
      warehouses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Warehouse
exports.getWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    res.status(200).json({
      success: true,
      warehouse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Warehouse by Code
exports.getWarehouseByCode = async (req, res) => {
  try {
    const warehouse = await Warehouse.findOne({
      warehouseCode: req.params.code.toUpperCase(),
    });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    res.status(200).json({
      success: true,
      warehouse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
