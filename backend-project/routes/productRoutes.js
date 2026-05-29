const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, productController.createProduct);
router.get("/", protect, productController.getAllProducts);
router.get("/code/:code", protect, productController.getProductByCode);
router.get(
  "/category/:category",
  protect,
  productController.getProductsByCategory,
);
router.get("/low-stock", protect, productController.getLowStockProducts);
router.get("/:id", protect, productController.getProduct);

module.exports = router;
