import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Profile", icon: "👤", path: "/dashboard/profile" },
    { name: "My Courses", icon: "📚", path: "/dashboard/courses" },
    { name: "Settings", icon: "⚙️", path: "/dashboard/settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="sidebar">
      <h2>Skill.AI</h2>

      <ul>
        {menu.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path}>
              {item.icon} {item.name}
            </Link>
          </li>
        ))}

        <li
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          🚪 Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;