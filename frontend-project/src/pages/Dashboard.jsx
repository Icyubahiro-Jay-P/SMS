import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {user?.username}!
          </h1>
          <p className="text-gray-600">Stock Management System Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/products"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">📦</div>
            <h2 className="text-xl font-semibold text-gray-800">Products</h2>
            <p className="text-gray-600 text-sm">Manage all products</p>
          </Link>

          <Link
            to="/warehouses"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">🏢</div>
            <h2 className="text-xl font-semibold text-gray-800">Warehouses</h2>
            <p className="text-gray-600 text-sm">Manage warehouses</p>
          </Link>

          <Link
            to="/transactions"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">🔄</div>
            <h2 className="text-xl font-semibold text-gray-800">
              Transactions
            </h2>
            <p className="text-gray-600 text-sm">View stock movements</p>
          </Link>

          <Link
            to="/reports"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">📊</div>
            <h2 className="text-xl font-semibold text-gray-800">Reports</h2>
            <p className="text-gray-600 text-sm">Generate reports</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📈 System Status: Active</p>
              <p>🔐 Role: {user?.role || "Staff"}</p>
              <p>✅ Database: Connected</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-600">
              Welcome to the Stock Management System. Start by adding products
              or warehouses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
