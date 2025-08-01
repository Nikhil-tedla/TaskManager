import { ExternalLink, Inbox, Share2, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip } from "recharts";

const UserLayout = ({ children}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
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
            onClick={() => navigate("/user/dashboard")}
            className="text-2xl font-bold text-blue-600 cursor-pointer"
          >
            User Panel
          </h1>
          <button onClick={() => navigate("/user/dashboard")} className={navLinkClass("/user/dashboard")}>
            Dashboard
          </button>
          <button onClick={() => navigate("/user/tasks")} className={navLinkClass("/user/tasks")}>
            View Tasks
          </button>
          
          
        </div>
          
        {/* Profile Dropdown */}
        <div className="flex gap-8 items-center">
          <div>
          <button
                onClick={() => navigate("user/shared-tasks")}
                className="w-full px-4 py-2 text-left hover:bg-blue-100"
              >
                <Inbox className="w-8 h-8 text-blue-500" />
              </button>
          
          </div>
          <div className="relative z-10">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold"
          >
            U
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
              <button
                onClick={() => navigate("user/profile")}
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
        </div>
        
      </nav>

      {/* Page Content */}
      <main className="p-6">{children}</main>
    </div>
  );
};

export default UserLayout;
