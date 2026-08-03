import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Profile", icon: "👤", path: "/dashboard/profile" },
    { name: "My Courses", icon: "📚", path: "/dashboard/courses" },
    { name: "Settings", icon: "⚙️", path: "/dashboard/settings" },
  ];

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
      </ul>
    </div>
  );
};

export default Sidebar;