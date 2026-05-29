import React, { useState, useEffect } from "react";
import { transactionAPI, productAPI, warehouseAPI } from "../api/index";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productCode: "",
    warehouseCode: "",
    quantityMoved: 0,
    transactionType: "IN",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transRes, prodRes, wareRes] = await Promise.all([
        transactionAPI.getAllTransactions(),
        productAPI.getAllProducts(),
        warehouseAPI.getAllWarehouses(),
      ]);
      setTransactions(transRes.data.transactions);
      setProducts(prodRes.data.products);
      setWarehouses(wareRes.data.warehouses);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantityMoved" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transactionAPI.createTransaction(formData);
      setFormData({
        productCode: "",
        warehouseCode: "",
        quantityMoved: 0,
        transactionType: "IN",
        notes: "",
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create transaction");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      try {
        await transactionAPI.deleteTransaction(id);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete transaction");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Stock Transactions
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            {showForm ? "Cancel" : "+ Record Transaction"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Record New Transaction
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <select
                name="productCode"
                value={formData.productCode}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.productName} ({p.productCode})
                  </option>
                ))}
              </select>

              <select
                name="warehouseCode"
                value={formData.warehouseCode}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Select Warehouse</option>
                {warehouses.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.warehouseName} ({w.warehouseCode})
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="quantityMoved"
                placeholder="Quantity"
                value={formData.quantityMoved}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />

              <select
                name="transactionType"
                value={formData.transactionType}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                <option value="IN">Stock IN</option>
                <option value="OUT">Stock OUT</option>
              </select>

              <input
                type="text"
                name="notes"
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={handleInputChange}
                className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />

              <button
                type="submit"
                className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                Record Transaction
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    Warehouse
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(txn.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {txn.productCode?.productName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {txn.warehouseCode?.warehouseName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                          txn.transactionType === "IN"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {txn.transactionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {txn.quantityMoved}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDelete(txn._id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
