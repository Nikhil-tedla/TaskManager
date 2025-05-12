import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = ({ children}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);

    navigate("/login");
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch?.(e.target.value); // notify parent if exists
  };

  const navLinkClass = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Nav */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <h1
            onClick={() => navigate("/admin/dashboard")}
            className="text-2xl font-bold text-blue-600 cursor-pointer"
          >
            Admin Panel
          </h1>
          <button onClick={() => navigate("/admin/dashboard")} className={navLinkClass("/admin/dashboard")}>
            Dashboard
          </button>
          <button onClick={() => navigate("/admin/tasks")} className={navLinkClass("/admin/tasks")}>
            View Tasks
          </button>
          <button
            onClick={() => navigate("/admin/create-task")}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            + Create Task
          </button>
          
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold"
          >
            U
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
              <button
                onClick={() => navigate("admin/profile")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main className="p-6">{children}</main>
    </div>
  );
};

export default AdminLayout;
