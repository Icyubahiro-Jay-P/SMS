import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth API
export const authAPI = {
  register: (data) => apiClient.post("/auth/register", data),
  login: (data) => apiClient.post("/auth/login", data),
  logout: () => apiClient.post("/auth/logout"),
  getCurrentUser: () => apiClient.get("/auth/me"),
};

// Product API
export const productAPI = {
  createProduct: (data) => apiClient.post("/products", data),
  getAllProducts: () => apiClient.get("/products"),
  getProductById: (id) => apiClient.get(`/products/${id}`),
  getProductByCode: (code) => apiClient.get(`/products/code/${code}`),
  getProductsByCategory: (category) =>
    apiClient.get(`/products/category/${category}`),
  getLowStockProducts: (threshold) =>
    apiClient.get("/products/low-stock", { params: { threshold } }),
};

// Warehouse API
export const warehouseAPI = {
  createWarehouse: (data) => apiClient.post("/warehouses", data),
  getAllWarehouses: () => apiClient.get("/warehouses"),
  getWarehouseById: (id) => apiClient.get(`/warehouses/${id}`),
  getWarehouseByCode: (code) => apiClient.get(`/warehouses/code/${code}`),
};

// Transaction API
export const transactionAPI = {
  createTransaction: (data) => apiClient.post("/transactions", data),
  getAllTransactions: () => apiClient.get("/transactions"),
  getTransactionById: (id) => apiClient.get(`/transactions/${id}`),
  getTransactionsByProduct: (productId) =>
    apiClient.get(`/transactions/product/${productId}`),
  getTransactionsByWarehouse: (warehouseId) =>
    apiClient.get(`/transactions/warehouse/${warehouseId}`),
  getTransactionsByDateRange: (startDate, endDate) =>
    apiClient.get("/transactions/by-date-range", {
      params: { startDate, endDate },
    }),
  updateTransaction: (id, data) => apiClient.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => apiClient.delete(`/transactions/${id}`),
};

// Report API
export const reportAPI = {
  getDailyReport: (date) =>
    apiClient.get("/reports/daily", { params: { date } }),
  getWeeklyReport: (startDate, endDate) =>
    apiClient.get("/reports/weekly", { params: { startDate, endDate } }),
  getMonthlyReport: (month, year) =>
    apiClient.get("/reports/monthly", { params: { month, year } }),
  getAvailableStockReport: () => apiClient.get("/reports/available-stock"),
};

export default apiClient;
