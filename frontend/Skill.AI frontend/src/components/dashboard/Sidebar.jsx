import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Profile", icon: "👤", path: "/dashboard/profile" },
    { name: "My Courses", icon: "📚", path: "/dashboard/courses" },
    { name: "Settings", icon: "⚙️", path: "/dashboard/settings" },
  ];

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const handleMenuClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <button
        className="dashboard-menu-toggle"
        aria-label="Toggle dashboard menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {sidebarOpen && (
        <div
          className="dashboard-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <h2>Skill.AI</h2>

        <ul>
          {menu.map((item) => (
            <li
              key={item.path}
              className={location.pathname === item.path ? "active" : ""}
            >
              <Link to={item.path} onClick={handleMenuClick}>
                {item.icon} {item.name}
              </Link>
            </li>
          ))}

          <li onClick={handleLogout}>
            🚪 Logout
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;