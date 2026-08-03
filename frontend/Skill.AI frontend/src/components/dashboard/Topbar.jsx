import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div className="topbar">
      <div>
        <h1>Welcome, {user?.name}</h1>
        <p>Have a great learning day 🚀</p>
      </div>

      <div className="topbar-right">
        <span className="notification">🔔</span>

        <div className="user-box">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h4>{user?.name}</h4>
            <small>{user?.email}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;