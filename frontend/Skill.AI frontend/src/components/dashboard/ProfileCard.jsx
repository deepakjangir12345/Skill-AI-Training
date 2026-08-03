import { useAuth } from "../../context/AuthContext";

const ProfileCard = () => {
  const { user } = useAuth();

  return (
    <div className="profile-card">
      <h2>My Profile</h2>

      <div className="profile-item">
        <strong>Name</strong>
        <span>{user?.name}</span>
      </div>

      <div className="profile-item">
        <strong>Email</strong>
        <span>{user?.email}</span>
      </div>

      <div className="profile-item">
        <strong>Role</strong>
        <span>{user?.role || "User"}</span>
      </div>

      <div className="profile-item">
        <strong>Login Method</strong>
        <span>{user?.authProvider || "Email"}</span>
      </div>
    </div>
  );
};

export default ProfileCard;