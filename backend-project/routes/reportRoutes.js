const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

router.get("/daily", protect, reportController.getDailyReport);
router.get("/weekly", protect, reportController.getWeeklyReport);
router.get("/monthly", protect, reportController.getMonthlyReport);
router.get(
  "/available-stock",
  protect,
  reportController.getAvailableStockReport,
);

module.exports = router;
