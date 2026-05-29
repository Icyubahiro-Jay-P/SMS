import React, { useState, useEffect } from "react";
import { productAPI } from "../api/index";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    category: "",
    quantityInStock: 0,
    unitPrice: 0,
    supplierName: "",
    dateReceived: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      setProducts(response.data.products);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "quantityInStock" || name === "unitPrice"
          ? parseFloat(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productAPI.createProduct(formData);
      setFormData({
        productCode: "",
        productName: "",
        category: "",
        quantityInStock: 0,
        unitPrice: 0,
        supplierName: "",
        dateReceived: "",
      });
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            {showForm ? "Cancel" : "+ Add Product"}
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
              Add New Product
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="productCode"
                placeholder="Product Code"
                value={formData.productCode}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="text"
                name="productName"
                placeholder="Product Name"
                value={formData.productName}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="number"
                name="quantityInStock"
                placeholder="Quantity in Stock"
                value={formData.quantityInStock}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="number"
                name="unitPrice"
                placeholder="Unit Price"
                value={formData.unitPrice}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="text"
                name="supplierName"
                placeholder="Supplier Name"
                value={formData.supplierName}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="date"
                name="dateReceived"
                value={formData.dateReceived}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="submit"
                className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                Create Product
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.productName}
                </h3>
                <p className="text-sm text-gray-600">
                  Code: {product.productCode}
                </p>
                <p className="text-sm text-gray-600">
                  Category: {product.category}
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="font-medium">
                    Stock: {product.quantityInStock} units
                  </p>
                  <p>Price: {product.unitPrice} Frw</p>
                  <p>Supplier: {product.supplierName}</p>
                </div>
                <div
                  className={`mt-3 px-2 py-1 rounded text-white text-xs font-semibold inline-block ${
                    product.quantityInStock > 20
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {product.quantityInStock > 20 ? "In Stock" : "Low Stock"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
