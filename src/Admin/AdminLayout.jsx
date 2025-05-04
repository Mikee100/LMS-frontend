import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin</h1>
        <ul>
          <li className="mb-4">
            <Link to="/admin/dashboard" className="hover:text-blue-400">Dashboard</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/courses" className="hover:text-blue-400">Manage Courses</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/users" className="hover:text-blue-400">Manage Users</Link>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <div className="flex-1 p-8">
        <Outlet /> {/* Render nested routes */}
      </div>
    </div>
  );
}
