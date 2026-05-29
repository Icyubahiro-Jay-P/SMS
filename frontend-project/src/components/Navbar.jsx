import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-2xl font-bold hover:text-blue-100"
            >
              SMS
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/products"
                className="hover:bg-blue-700 px-3 py-2 rounded"
              >
                Products
              </Link>
              <Link
                to="/warehouses"
                className="hover:bg-blue-700 px-3 py-2 rounded"
              >
                Warehouses
              </Link>
              <Link
                to="/transactions"
                className="hover:bg-blue-700 px-3 py-2 rounded"
              >
                Transactions
              </Link>
              <Link
                to="/reports"
                className="hover:bg-blue-700 px-3 py-2 rounded"
              >
                Reports
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">{user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
