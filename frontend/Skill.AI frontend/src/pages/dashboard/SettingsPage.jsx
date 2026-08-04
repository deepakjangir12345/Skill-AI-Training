import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "./SettingsPage.css";

const SettingsPage = () => {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    bio: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef(null);
const [selectedFile, setSelectedFile] = useState(null);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
  setSelectedFile(e.target.files[0]);
};

const handleUploadPhoto = async () => {
  if (!selectedFile) {
    alert("Please select an image.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("image", selectedFile);

    const res = await api.post(
      "/upload/profile-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // ✅ AuthContext update
    setUser(res.data.user);

    // ✅ LocalStorage update
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    // ✅ Settings form update
    setProfile({
      name: res.data.user.name || "",
      email: res.data.user.email || "",
      phone: res.data.user.phone || "",
      college: res.data.user.college || "",
      bio: res.data.user.bio || "",
    });

    alert(res.data.message);

    loadProfile();

  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Upload failed."
    );
  }
};

  useEffect(() => {
  loadProfile();
}, []);

const loadProfile = async () => {
  try {
    const res = await api.get("/profile");
    console.log("API Response:", res.data);
console.log("User:", res.data.user);

    setProfile({
      name: res.data.user.name || "",
      email: res.data.user.email || "",
      phone: res.data.user.phone || "",
      college: res.data.user.college || "",
      bio: res.data.user.bio || "",
    });

  } catch (err) {
    console.error(err);
  }
};

  
  const handleSaveProfile = async (e) => {
  e.preventDefault();

  try {
    const res = await api.put("/profile", profile);

    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setProfile({
      name: res.data.user.name || "",
      email: res.data.user.email || "",
      phone: res.data.user.phone || "",
      college: res.data.user.college || "",
      bio: res.data.user.bio || "",
    });

    alert(res.data.message);

  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Failed to update profile."
    );
  }
};
  const handleChangePassword = async (e) => {
  e.preventDefault();

  if (password.newPassword !== password.confirmPassword) {
    alert("New Password and Confirm Password do not match.");
    return;
  }

  try {
    const res = await api.put("/password/change", {
      currentPassword: password.currentPassword,
      newPassword: password.newPassword,
    });

    alert(res.data.message);

    setPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Failed to change password."
    );
  }
};

  return (
    <div className="settings-page">

      <h2 className="settings-title">
        ⚙ Account Settings
      </h2>

      {/* Profile */}

      <div className="settings-section">

        <h3>👤 Profile Information</h3>

        <form onSubmit={handleSaveProfile}>

          <div className="settings-grid">

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label>College</label>

              <input
                type="text"
                name="college"
                value={profile.college}
                onChange={handleProfileChange}
                placeholder="Enter college"
              />
            </div>

            <div className="form-group">
              <label>Email</label>

            <input
            type="email"
            value={profile.email || ""}
            disabled
            />
            </div>

            <div className="form-group full">
              <label>Bio</label>

              <textarea
                rows="5"
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                placeholder="Tell us something about yourself..."
              />
            </div>

          </div>

          <button className="settings-btn">
            Save Profile
          </button>

        </form>

      </div>

      {/* Password */}

      <div className="settings-section">

        <h3>🔒 Change Password</h3>

        <form onSubmit={handleChangePassword}>

          <div className="settings-grid">

            <div className="form-group">
              <label>Current Password</label>

              <input
                type="password"
                name="currentPassword"
                value={password.currentPassword}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>

              <input
                type="password"
                name="newPassword"
                value={password.newPassword}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="form-group full">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={password.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>

          </div>

          <button className="settings-btn">
            Update Password
          </button>

        </form>

      </div>

      {/* Photo */}

      <div className="settings-section">

        <h3>🖼 Profile Photo</h3>

        <div className="photo-preview">
          👤
        </div>

        <input
  type="file"
  ref={fileInputRef}
  accept="image/*"
  onChange={handleFileChange}
/>

<button
  type="button"
  className="settings-btn"
  onClick={handleUploadPhoto}
>
  Upload Photo
</button>

      </div>

    </div>
  );
};

export default SettingsPage;