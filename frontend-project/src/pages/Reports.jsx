import React, { useState } from "react";
import { reportAPI } from "../api/index";

const Reports = () => {
  const [reportType, setReportType] = useState("daily");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    date: new Date().toISOString().split("T")[0],
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      let response;
      switch (reportType) {
        case "daily":
          response = await reportAPI.getDailyReport(filters.date);
          break;
        case "weekly":
          response = await reportAPI.getWeeklyReport(
            filters.startDate,
            filters.endDate,
          );
          break;
        case "monthly":
          response = await reportAPI.getMonthlyReport(
            filters.month,
            filters.year,
          );
          break;
        case "stock":
          response = await reportAPI.getAvailableStockReport();
          break;
        default:
          break;
      }
      setReport(response.data.report);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => {
                  setReportType(e.target.value);
                  setReport(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                <option value="daily">Daily Report</option>
                <option value="weekly">Weekly Report</option>
                <option value="monthly">Monthly Report</option>
                <option value="stock">Available Stock Report</option>
              </select>
            </div>

            {reportType === "daily" && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>
            )}

            {reportType === "weekly" && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </>
            )}

            {reportType === "monthly" && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Month
                  </label>
                  <select
                    name="month"
                    value={filters.month}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2024, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={filters.year}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </>
            )}
          </div>

          {reportType !== "stock" && (
            <button
              onClick={fetchReport}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          )}
          {reportType === "stock" && (
            <button
              onClick={fetchReport}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load Stock Report"}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {report && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {reportType === "daily" && `Daily Report - ${report.date}`}
              {reportType === "weekly" &&
                `Weekly Report (${report.startDate} to ${report.endDate})`}
              {reportType === "monthly" &&
                `Monthly Report - ${new Date(2024, report.month - 1).toLocaleString("default", { month: "long" })} ${report.year}`}
              {reportType === "stock" && "Available Stock Report"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {reportType !== "stock" && (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Total Transactions</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {report.totalTransactions}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Stock In</p>
                    <p className="text-2xl font-bold text-green-600">
                      {report.totalStockIn}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Stock Out</p>
                    <p className="text-2xl font-bold text-red-600">
                      {report.totalStockOut}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Net Movement</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {report.totalStockIn - report.totalStockOut}
                    </p>
                  </div>
                </>
              )}

              {reportType === "stock" && (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Total Products</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {report.totalProducts}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Total Units</p>
                    <p className="text-2xl font-bold text-green-600">
                      {report.totalQuantity}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg col-span-2">
                    <p className="text-gray-600 text-sm">
                      Total Inventory Value
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${report.totalValue.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
            </div>

            {report.products && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Product Inventory
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Product Name</th>
                        <th className="px-4 py-2 text-left">Code</th>
                        <th className="px-4 py-2 text-right">Quantity</th>
                        <th className="px-4 py-2 text-right">Unit Price</th>
                        <th className="px-4 py-2 text-right">Total Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.products.map((p) => (
                        <tr key={p._id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">{p.productName}</td>
                          <td className="px-4 py-2">{p.productCode}</td>
                          <td className="px-4 py-2 text-right">
                            {p.quantityInStock}
                          </td>
                          <td className="px-4 py-2 text-right">
                            ${p.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-right font-semibold">
                            ${(p.quantityInStock * p.unitPrice).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {report.transactions && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Transaction Details
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-left">Warehouse</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-right">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.transactions.map((t) => (
                        <tr key={t._id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">
                            {new Date(t.transactionDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            {t.productCode?.productName}
                          </td>
                          <td className="px-4 py-2">
                            {t.warehouseCode?.warehouseName}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded text-white text-xs ${
                                t.transactionType === "IN"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            >
                              {t.transactionType}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right">
                            {t.quantityMoved}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
