import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

setTimeout(() => {
    window.location.href = "/courses";
}, 500); // ya /my-courses
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
};

export default GoogleAuthSuccess;
