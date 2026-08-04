import { useAuth } from "../../context/AuthContext";

const ProfileCard = () => {
  const { user } = useAuth();

  return (
    <div className="profile-card">

      <div className="profile-header">

        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="Profile"
            className="profile-avatar"
          />
        ) : (
          <div className="profile-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}

        <div>
          <h2>{user?.name || "User"}</h2>
          <p>{user?.email}</p>
        </div>

      </div>

      <hr />

      <div className="profile-item">
        <strong>👤 Full Name</strong>
        <span>{user?.name || "Not Added"}</span>
      </div>

      <div className="profile-item">
        <strong>📧 Email</strong>
        <span>{user?.email || "Not Added"}</span>
      </div>

      <div className="profile-item">
        <strong>🛡 Role</strong>
        <span>{user?.role || "User"}</span>
      </div>

      <div className="profile-item">
        <strong>🔐 Login Method</strong>
        <span>{user?.authProvider || "Email"}</span>
      </div>

      <div className="profile-item">
        <strong>📱 Phone</strong>
        <span>{user?.phone || "Not Added"}</span>
      </div>

      <div className="profile-item">
        <strong>🏫 College</strong>
        <span>{user?.college || "Not Added"}</span>
      </div>

      <div className="profile-item">
        <strong>📝 Bio</strong>
        <span>{user?.bio || "Not Added"}</span>
      </div>

      <button className="edit-btn">
        ✏ Edit Profile
      </button>

    </div>
  );
};

export default ProfileCard;