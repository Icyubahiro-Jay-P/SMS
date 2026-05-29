import React, { useState, useEffect } from "react";
import { warehouseAPI } from "../api/index";

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    warehouseCode: "",
    warehouseName: "",
    warehouseLocation: "",
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await warehouseAPI.getAllWarehouses();
      setWarehouses(response.data.warehouses);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch warehouses");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await warehouseAPI.createWarehouse(formData);
      setFormData({
        warehouseCode: "",
        warehouseName: "",
        warehouseLocation: "",
      });
      setShowForm(false);
      fetchWarehouses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create warehouse");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            {showForm ? "Cancel" : "+ Add Warehouse"}
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
              Add New Warehouse
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <input
                type="text"
                name="warehouseCode"
                placeholder="Warehouse Code"
                value={formData.warehouseCode}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="text"
                name="warehouseName"
                placeholder="Warehouse Name"
                value={formData.warehouseName}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="text"
                name="warehouseLocation"
                placeholder="Location"
                value={formData.warehouseLocation}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="submit"
                className="md:col-span-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                Create Warehouse
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading warehouses...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warehouses.map((warehouse) => (
              <div
                key={warehouse._id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
              >
                <div className="flex items-start">
                  <div className="text-2xl mr-3">🏢</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {warehouse.warehouseName}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      Code: {warehouse.warehouseCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      📍 {warehouse.warehouseLocation}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Created:{" "}
                      {new Date(warehouse.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Warehouses;
