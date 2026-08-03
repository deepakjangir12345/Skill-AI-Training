import { useEffect, useState } from "react";
import api from "../../utils/api";

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    progress: 0,
    certificates: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");

      setStats(response.data.stats);
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
    }
  };

  const cards = [
    {
      title: "My Courses",
      value: stats.totalCourses,
      icon: "📚",
    },
    {
      title: "Completed",
      value: stats.completedCourses,
      icon: "🎓",
    },
    {
      title: "Progress",
      value: `${stats.progress}%`,
      icon: "📈",
    },
    {
      title: "Certificates",
      value: stats.certificates,
      icon: "🏆",
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((item, index) => (
        <div className="stat-card" key={index}>
          <h2>{item.icon}</h2>

          <h3>{item.value}</h3>

          <p>{item.title}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;