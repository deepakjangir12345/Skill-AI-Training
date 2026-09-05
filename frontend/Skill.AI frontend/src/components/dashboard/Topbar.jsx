import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div className="topbar">

      {/* Welcome Hero */}
      <div className="welcome-hero">

        <div className="welcome-content">

          <span className="welcome-badge">
            ✨ YOUR LEARNING SPACE
          </span>

          <h1>
            Welcome back,
            <span>{user?.name}!</span>
          </h1>

          <p>
            We're happy to have you here.
            <br />
            Let's continue your learning journey and achieve
            something amazing today.
          </p>

          <button className="welcome-btn">
            Let's Continue Learning
            <span>→</span>
          </button>

        </div>

        {/* 3D Illustration */}
        <div className="welcome-visual">

          <div className="welcome-glow"></div>

          <div className="floating-shape shape-one">✦</div>
          <div className="floating-shape shape-two">◆</div>
          <div className="floating-shape shape-three">✦</div>

          <div className="learning-orb">

            <div className="orb-ring"></div>

            <div className="student-figure">
              <div className="student-head">
                <span className="student-hair"></span>
              </div>

              <div className="student-body">
                <span className="student-logo">AI</span>
              </div>

              <div className="student-arm"></div>
            </div>

            <div className="book-stack">
              <div className="book book-one"></div>
              <div className="book book-two"></div>
              <div className="book book-three"></div>
            </div>

          </div>

          <div className="learning-message">
            <strong>Keep Learning,</strong>
            <span>Keep Growing! 🚀</span>
          </div>

        </div>

      </div>

      {/* Existing User Area */}
      <div className="topbar-right">

        <span className="notification">
          🔔
        </span>

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