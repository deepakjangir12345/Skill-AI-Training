import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "100px",
            margin: 0,
            color: "#6d28d9",
          }}
        >
          404
        </h1>

        <h2>Oops! Page Not Found</h2>

        <p style={{ color: "#666", marginBottom: "30px" }}>
          The page you are looking for doesn't exist.
        </p>

        <Link
          to="/"
          style={{
            background: "#6d28d9",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
