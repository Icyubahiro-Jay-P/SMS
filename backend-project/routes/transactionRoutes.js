const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, transactionController.createTransaction);
router.get("/", protect, transactionController.getAllTransactions);
router.get(
  "/by-date-range",
  protect,
  transactionController.getTransactionsByDateRange,
);
router.get(
  "/product/:productId",
  protect,
  transactionController.getTransactionsByProduct,
);
router.get(
  "/warehouse/:warehouseId",
  protect,
  transactionController.getTransactionsByWarehouse,
);
router.get("/:id", protect, transactionController.getTransaction);
router.put("/:id", protect, transactionController.updateTransaction);
router.delete("/:id", protect, transactionController.deleteTransaction);

module.exports = router;
