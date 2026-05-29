const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouseController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, warehouseController.createWarehouse);
router.get("/", protect, warehouseController.getAllWarehouses);
router.get("/code/:code", protect, warehouseController.getWarehouseByCode);
router.get("/:id", protect, warehouseController.getWarehouse);

module.exports = router;
